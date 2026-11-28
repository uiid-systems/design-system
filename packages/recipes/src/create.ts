/**
 * `uiid-recipes create <dir>`: makes a new Next.js app with create-next-app,
 * then runs the same steps as `add` on it and, because the app is known to be
 * untouched, replaces its starter layout, stylesheet and home page with the
 * recipe's templates. `cli.ts` parses the command line and calls `runCreate`.
 *
 * Everything that can be checked before the scaffold is checked first, so a
 * refusal runs nothing and creates nothing. After the scaffold, its output is
 * treated as untrusted and checked again with `add`'s checks. A failure from
 * then on leaves the directory in place and says so. The only things `create`
 * deletes are the three files in `REPLACED`, each right before it is created
 * anew; a write that fails in between leaves that one file missing.
 *
 * What `create` may write is fixed here, not in the manifest: every file under
 * `files/` and every template, each created exclusively, except the three
 * files in `REPLACED`, which must exist as regular files and are each deleted
 * and created anew.
 */
import { lstatSync, readdirSync, realpathSync, statSync } from "node:fs";
import { builtinModules } from "node:module";
import { basename, dirname, join, resolve } from "node:path";

import {
  checkApp,
  checkNewFiles,
  checkReplaceable,
  type CliIo,
  commandLine,
  describe,
  type Install,
  installOf,
  isRecord,
  packageManagerAt,
  q,
  readRecipe,
  type Recipe,
  Refusal,
  runInstall,
  show,
  workspaceFor,
  type Write,
  writeFiles,
} from "./add.ts";

/**
 * The create-next-app to scaffold with. Its major must match the major of
 * `next` the recipe is built on, which is the docs app's (`apps/docs`); a
 * test fails when they differ.
 */
export const CREATE_NEXT_APP = "create-next-app@16";

/**
 * create-next-app 16's options, from its own source at v16.4.6
 * (`packages/create-next-app/index.ts`) and the Next.js docs page for the
 * CLI. Every option is passed explicitly, so no default or saved preference
 * decides it.
 */
export const SCAFFOLD_FLAGS = [
  // Never prompt; with a directory argument nothing else asks.
  "--yes",
  "--ts",
  "--app",
  "--no-src-dir",
  "--no-tailwind",
  // Two arguments, so no shell ever sees the `*`.
  "--import-alias",
  "@/*",
  "--no-linter",
  "--no-react-compiler",
  // The docs app, where the recipe is built, does not use Cache Components.
  "--no-cache-components",
  "--agents-md",
  "--no-agent-feedback",
  // npm ships with Node, so the scaffold needs nothing else installed.
  "--use-npm",
];

/** The scaffold's own files that the templates replace. Fixed here, not in the manifest. */
export const REPLACED: ReadonlySet<string> = new Set([
  "app/layout.tsx",
  "app/globals.css",
  "app/page.tsx",
]);

/** The one recipe `create` applies. */
const RECIPE = "app-shell";

/** What create-next-app accepts as the new package's name, which is the directory's. */
const DIRECTORY_NAME = /^[a-z0-9][a-z0-9._-]*$/;

/** The command that starts the dev server, by package manager. */
const DEV: Record<string, string> = {
  npm: "npm run dev",
  pnpm: "pnpm dev",
  yarn: "yarn dev",
  bun: "bun run dev",
};

const NO_THROW = { throwIfNoEntry: false } as const;
const NEW_DIRECTORY =
  "name a directory that does not exist yet, or an empty one";

type Plan = {
  /** The new app's directory, by the real path of its parent. */
  root: string;
  parent: string;
  recipe: Recipe;
  /** The workspace root when the new app is one of its members. */
  workspace: string | undefined;
  scaffold: Install;
  /** Files and templates in write order, the replaced ones included. */
  writes: Write[];
  /** The install `create` expects to run, for `--dry-run`. */
  install: Install | undefined;
};

/** Every check `create` makes before the scaffold. Throws a `Refusal`; runs and writes nothing. */
function planCreate(
  dir: string,
  {
    cwd,
    recipesRoot,
    repoRoot,
  }: Pick<CliIo, "cwd" | "recipesRoot" | "repoRoot">,
): Plan {
  const target = resolve(cwd, dir);
  const parentStat = statSync(dirname(target), NO_THROW);
  if (!parentStat) {
    throw new Refusal(
      `The parent directory of ${q(target)} does not exist: create it first, or name a directory inside one that exists.`,
    );
  }
  if (!parentStat.isDirectory()) {
    throw new Refusal(
      `The parent directory of ${q(target)} is not a directory: name a directory inside one that exists.`,
    );
  }
  const parent = realpathSync(dirname(target));
  const name = basename(target);
  const root = join(parent, name);

  const stat = lstatSync(root, NO_THROW);
  if (stat?.isSymbolicLink()) {
    throw new Refusal(
      `${q(root)} is a symlink, which create does not follow: ${NEW_DIRECTORY}.`,
    );
  }
  if (stat && !stat.isDirectory()) {
    throw new Refusal(`${q(root)} is not a directory: ${NEW_DIRECTORY}.`);
  }
  // Any entry counts, dot-named ones included.
  if (stat && readdirSync(root).length > 0) {
    throw new Refusal(
      `${q(root)} is not empty, so create changed nothing: ${NEW_DIRECTORY}.`,
    );
  }
  if (
    name.length > 214 ||
    !DIRECTORY_NAME.test(name) ||
    name === "node_modules" ||
    name === "favicon.ico" ||
    builtinModules.includes(name)
  ) {
    throw new Refusal(
      `The directory name ${q(name)} is not one create-next-app accepts as a package name: use lower-case letters, digits, ".", "_" and "-", starting with a letter or a digit, and not a Node.js module name such as "http".`,
    );
  }

  const recipe = readRecipe(RECIPE, recipesRoot, "create");
  for (const dest of REPLACED) {
    if (!recipe.templates.some(([, d]) => d === dest)) {
      throw new Refusal(
        `The recipe's manifest maps no template to ${q(dest)}, which create replaces: fix the recipe's recipe.json.`,
      );
    }
  }

  // A workspace member is installed by the workspace's package manager when
  // the recipe's dependencies are added, so create-next-app installs nothing.
  const workspace = workspaceFor(root, recipe.deps, repoRoot, "create");
  const manager = workspace ? packageManagerAt(workspace, "create") : "npm";
  const scaffold = {
    command: "npx",
    args: [
      "--yes",
      CREATE_NEXT_APP,
      name,
      ...SCAFFOLD_FLAGS,
      ...(workspace ? ["--skip-install"] : []),
    ],
  };

  const writes: Write[] = [
    ...recipe.sources.map((file) => ({
      source: join(recipe.filesDir, file),
      file,
    })),
    ...recipe.templates.map(([key, file]) => ({
      source: join(recipe.templatesDir, key),
      file,
    })),
  ];
  return {
    root,
    parent,
    recipe,
    workspace,
    scaffold,
    writes,
    install: installOf(manager, recipe.deps),
  };
}

/**
 * Refuses an app that depends on Tailwind or has a PostCSS config in any
 * place Next.js reads one: `postcss.config.*`, `.postcssrc`, `.postcssrc.*`
 * or a `postcss` key in `package.json`, whose parsed contents are `pkg`.
 */
function checkNoTailwind(root: string, pkg: unknown): void {
  const tailwind = ["dependencies", "devDependencies"]
    .flatMap((field) =>
      isRecord(pkg) && isRecord(pkg[field]) ? Object.keys(pkg[field]) : [],
    )
    .filter((dep) => dep === "tailwindcss" || dep.startsWith("@tailwindcss/"));
  const postcss = [
    ...readdirSync(root)
      .filter(
        (entry) =>
          entry.startsWith("postcss.config.") ||
          entry === ".postcssrc" ||
          entry.startsWith(".postcssrc."),
      )
      .sort()
      .map(q),
    ...(isRecord(pkg) && "postcss" in pkg
      ? [`the "postcss" key in package.json`]
      : []),
  ];
  const problems = [
    ...(tailwind.length > 0
      ? [`it depends on Tailwind (${tailwind.map(q).join(", ")})`]
      : []),
    ...(postcss.length > 0
      ? [`it has a PostCSS config (${postcss.join(", ")})`]
      : []),
  ];
  if (problems.length > 0) {
    const problem = problems.join(" and ");
    throw new Refusal(`${problem}.`, problem);
  }
}

/**
 * `add`'s checks, and create's own, on what the scaffold made. Returns the
 * package manager and the install to run. Throws a `Refusal`; reads only.
 */
function checkScaffold(plan: Plan): {
  manager: string;
  install: Install | undefined;
} {
  const { root, recipe, workspace, writes } = plan;
  checkNoTailwind(root, checkApp(root, "create"));
  checkNewFiles(
    root,
    writes.filter(({ file }) => !REPLACED.has(file)),
    "create",
  );
  for (const file of REPLACED) checkReplaceable(root, file, "create");
  // A workspace member has no lockfile of its own: it is the workspace's.
  const manager = packageManagerAt(workspace ?? root, "create");
  return { manager, install: installOf(manager, recipe.deps) };
}

/** One sentence for a failure after the scaffold started. */
const leftInPlace = (root: string, what: string, fix = "delete it") =>
  `${what}, so create stopped with ${q(root)} left in place: ${fix}, then run create again.`;

/** `create`: plans, scaffolds, checks, writes, installs, and returns the exit code. */
export function runCreate(dir: string, dryRun: boolean, io: CliIo): number {
  let plan: Plan;
  try {
    plan = planCreate(dir, io);
  } catch (error) {
    io.error(
      error instanceof Refusal
        ? error.message
        : `create stopped before running anything, because of ${describe(error)}: fix that, then run create again.`,
    );
    return 1;
  }
  const { root, parent, scaffold } = plan;
  const verb = (file: string) => (REPLACED.has(file) ? "replace" : "write  ");

  if (dryRun) {
    // An existing empty directory is accepted, so only say "not created"
    // when there is none.
    io.log(
      lstatSync(root, NO_THROW)
        ? `uiid-recipes create --dry-run: nothing was run or written in ${q(root)}`
        : `uiid-recipes create --dry-run: nothing was run or written, and ${q(root)} was not created`,
    );
    io.log(`  would run     ${commandLine(scaffold)} in ${q(parent)}`);
    for (const { file } of plan.writes) {
      io.log(`  would ${verb(file)} ${show(file)}`);
    }
    if (plan.install) io.log(`  would run     ${commandLine(plan.install)}`);
    return 0;
  }

  // The scaffold.
  io.log(`  running  ${commandLine(scaffold)} in ${q(parent)}`);
  let status: number;
  try {
    status = io.run(scaffold.command, scaffold.args, parent);
  } catch (error) {
    io.error(
      leftInPlace(
        root,
        `create-next-app could not start (${describe(error)})`,
        "delete it if it exists",
      ),
    );
    return 1;
  }
  if (status !== 0) {
    io.error(
      leftInPlace(
        root,
        `create-next-app exited with code ${status}`,
        "delete it if it exists",
      ),
    );
    return 1;
  }

  let manager: string;
  let install: Install | undefined;
  try {
    const made = lstatSync(root, NO_THROW);
    if (!made?.isDirectory() || readdirSync(root).length === 0) {
      io.error(
        leftInPlace(
          root,
          "create-next-app exited 0 but made no app",
          "delete it if it exists",
        ),
      );
      return 1;
    }
    ({ manager, install } = checkScaffold(plan));
  } catch (error) {
    const problem = error instanceof Refusal ? error.problem : describe(error);
    io.error(
      leftInPlace(
        root,
        `The app create-next-app made fails a check (${problem})`,
      ),
    );
    return 1;
  }

  // The recipe, then the templates, with the three starter files replaced.
  const failed = writeFiles(root, plan.writes, io.log, REPLACED);
  if (failed) {
    io.error(
      leftInPlace(
        root,
        `Writing ${show(failed.file)} failed (${describe(failed.error)})`,
      ),
    );
    return 1;
  }

  if (install && !runInstall(install, root, io)) {
    io.error(
      `The install failed, so create stopped with ${q(root)} left in place: run ${commandLine(install)} in it by hand, or delete it and run create again.`,
    );
    return 1;
  }
  io.log(
    `uiid-recipes create: made the app in ${q(root)}; start it by running ${DEV[manager]} in that directory.`,
  );
  return 0;
}
