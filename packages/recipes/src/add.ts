/**
 * `uiid-recipes add <recipe>`: copies a recipe into a Next.js app that already
 * exists. `cli.mjs` is the bin and only calls `runCli` here.
 *
 * Plain Node with no dependencies, like `recipes.ts`: Node runs this
 * TypeScript directly by stripping its types.
 *
 * Every check runs before anything is written, so a refusal leaves the app
 * byte for byte as it was. Then the recipe's files are written, then the
 * starter `nav.ts` when the app has none, and the dependency install runs
 * last. What `add` may write is fixed here, not in the manifest: every file
 * under `files/` and the one template `nav.ts`.
 */
import { spawnSync } from "node:child_process";
import {
  lstatSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
} from "node:fs";
import { isAbsolute, join, posix, relative, resolve, sep } from "node:path";

import {
  checkRelativePath,
  copyFiles,
  listRecipeFiles,
  safeTarget,
} from "./recipes.ts";

/** Runs a command with an argument array, never a shell, and returns its exit code. */
export type Runner = (command: string, args: string[], cwd: string) => number;

export type CliIo = {
  /** The directory the command was run from. */
  cwd: string;
  /** The directory holding one directory per recipe. */
  recipesRoot: string;
  /** This repository's root, whose `pnpm-workspace.yaml` decides membership. */
  repoRoot: string;
  run: Runner;
  log: (line: string) => void;
  error: (line: string) => void;
};

/** A refusal: one sentence saying what failed and what to do. */
class Refusal extends Error {}

const NO_THROW = { throwIfNoEntry: false } as const;
const q = (value: string) => JSON.stringify(value);

/** The default runner: `spawnSync` with no shell, output passed through. */
export const spawnRunner: Runner = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.error) throw result.error;
  return result.status ?? 1;
};

/**
 * What to add to the app by hand. `add` never edits the layout. Kept in step
 * with `templates/app/layout.tsx` and `templates/app/globals.css` by the tests
 * in `add.test.ts`, which fail when the imports, the elements or the
 * stylesheet differ.
 */
export const LAYOUT_WIRING = `Wire the shell into the app by hand; add did not change app/layout.tsx, app/globals.css or any page.

  /* app/globals.css: the first line */
  @import "@uiid/design-system/globals.css";

  // app/layout.tsx: import globals.css before any other stylesheet
  import "./globals.css";
  import { Header } from "@/components/header";
  import { Main } from "@/components/main";
  import { Shell, ShellBody } from "@/components/shell";
  import { Sidebar, SidebarScript } from "@/components/sidebar";

  // ...and return this from the root layout, keeping your own attributes
  <html lang="en" suppressHydrationWarning>
    <head>
      <SidebarScript />
    </head>
    <ShellBody>
      <Shell sidebar={<Sidebar title="My App" />} header={<Header />}>
        <Main>{children}</Main>
      </Shell>
    </ShellBody>
  </html>

The sidebar and the breadcrumbs read their pages from nav.ts at the app root.`;

const USAGE = `Usage: uiid-recipes add <recipe> [--cwd <dir>] [--dry-run]

Copies a recipe into the Next.js app in the current directory, or in --cwd <dir>.

Options:
  --cwd <dir>  The app's root directory. Defaults to the current directory.
  --dry-run    Run every check and print what would be written and run, changing nothing.
  -h, --help   Print this help.`;

/** Lockfiles at an app's root, and the package manager each belongs to. */
const LOCKFILES = new Map([
  ["pnpm-lock.yaml", "pnpm"],
  ["package-lock.json", "npm"],
  ["yarn.lock", "yarn"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
]);
const INSTALL_VERB: Record<string, string> = {
  pnpm: "add",
  npm: "install",
  yarn: "add",
  bun: "add",
};

/** A path add never writes, from `files/` or a template. Case-insensitive. */
function isProtected(path: string): boolean {
  const segments = path.toLowerCase().split("/");
  const name = segments[segments.length - 1];
  return (
    segments.some((s) => s === ".git" || s === "node_modules") ||
    name === "package.json" ||
    LOCKFILES.has(name) ||
    name === "tsconfig.json" ||
    name === "next.config" ||
    name.startsWith("next.config.") ||
    name === ".npmrc" ||
    name.startsWith(".env")
  );
}

/** A valid npm package name, scoped or not, that cannot be read as a flag. */
const PACKAGE_NAME = /^(?:@[a-z0-9~][a-z0-9._~-]*\/)?[a-z0-9~][a-z0-9._~-]*$/;
/**
 * A version range with no whitespace and no shell metacharacter. `*` is
 * allowed for `workspace:*`; no shell ever reads it. Ranges with `<`, `>`,
 * `|` or a space, such as `>=1 <2`, are refused.
 */
const RANGE = /^[A-Za-z0-9.^~*:+=/@_-]+$/;

/** An argument printed for a person to paste, quoted when it holds more than plain characters. */
const shellWord = (arg: string) =>
  /^[\w@/.:=+-]+$/.test(arg) ? arg : `'${arg}'`;

/**
 * Parses JSON with comments and trailing commas, as `tsconfig.json` allows,
 * without `eval` and without a dependency. Throws when the text is not that.
 */
export function parseJsonc(text: string): unknown {
  const source = text.replace(/^﻿/, "");
  // Copies a string literal starting at `i` to `out`, returning the index after it.
  const string = (src: string, i: number, out: string[]) => {
    let j = i + 1;
    while (j < src.length && src[j] !== '"') j += src[j] === "\\" ? 2 : 1;
    if (j >= src.length) throw new Error("An unterminated string");
    out.push(src.slice(i, j + 1));
    return j + 1;
  };

  const noComments: string[] = [];
  for (let i = 0; i < source.length;) {
    if (source[i] === '"') i = string(source, i, noComments);
    else if (source.startsWith("//", i)) {
      while (i < source.length && source[i] !== "\n") i++;
    } else if (source.startsWith("/*", i)) {
      const end = source.indexOf("*/", i + 2);
      if (end < 0) throw new Error("An unterminated comment");
      noComments.push(" ");
      i = end + 2;
    } else noComments.push(source[i++]);
  }

  const stripped = noComments.join("");
  const out: string[] = [];
  for (let i = 0; i < stripped.length;) {
    if (stripped[i] === '"') i = string(stripped, i, out);
    else if (stripped[i] === ",") {
      let j = i + 1;
      while (/\s/.test(stripped[j] ?? "")) j++;
      if (stripped[j] !== "}" && stripped[j] !== "]") out.push(",");
      i++;
    } else out.push(stripped[i++]);
  }
  return JSON.parse(out.join(""));
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const exists = (path: string) => lstatSync(path, NO_THROW) !== undefined;
const isDirectory = (path: string) =>
  lstatSync(path, NO_THROW)?.isDirectory() === true;

/** The recipes under `recipesRoot`: each directory holding a `recipe.json` file. */
function listRecipes(recipesRoot: string): string[] {
  return readdirSync(recipesRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        lstatSync(
          join(recipesRoot, entry.name, "recipe.json"),
          NO_THROW,
        )?.isFile(),
    )
    .map((entry) => entry.name)
    .sort();
}

/** The patterns under `packages:` in a `pnpm-workspace.yaml`. */
function workspacePatterns(yaml: string): string[] {
  const patterns: string[] = [];
  let inPackages = false;
  for (const line of yaml.split(/\r?\n/)) {
    if (/^packages:\s*(#.*)?$/.test(line)) inPackages = true;
    else if (inPackages) {
      const item = /^\s+-\s+(["']?)([^"'#\s]+)\1\s*(#.*)?$/.exec(line);
      if (item) patterns.push(item[2]);
      else if (line.trim() && !line.trim().startsWith("#")) inPackages = false;
    }
  }
  return patterns;
}

/**
 * This repository's root when `target` is one of its workspace members, by
 * `pnpm-workspace.yaml`. Patterns are matched segment by segment, with `*`
 * standing for one segment; `!` patterns exclude.
 */
function workspaceRootOf(target: string, repoRoot: string): string | undefined {
  let repo: string;
  let yaml: string;
  try {
    repo = realpathSync(repoRoot);
    yaml = readFileSync(join(repo, "pnpm-workspace.yaml"), "utf8");
  } catch {
    return undefined;
  }
  const rel = relative(repo, target);
  if (!rel || rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    return undefined;
  }
  const segments = rel.split(sep);
  const matches = (pattern: string) => {
    const parts = pattern.replace(/\/$/, "").split("/");
    return (
      parts.length === segments.length &&
      parts.every((part, k) =>
        part === "*" ? !segments[k].startsWith(".") : part === segments[k],
      )
    );
  };
  const patterns = workspacePatterns(yaml);
  const included = patterns.filter((p) => !p.startsWith("!")).some(matches);
  const excluded = patterns
    .filter((p) => p.startsWith("!"))
    .some((p) => matches(p.slice(1)));
  return included && !excluded ? repo : undefined;
}

/** A check that may throw from `recipes.ts`, turned into one sentence. */
function checked<T>(check: () => T): T {
  try {
    return check();
  } catch (error) {
    if (error instanceof Refusal) throw error;
    throw new Refusal(
      `${(error as Error).message}, so add wrote nothing: replace it with a real directory or file, then run add again.`,
    );
  }
}

type Plan = {
  root: string;
  /** `[source, target, path relative to the app]` for each recipe file. */
  files: [string, string, string][];
  /** The starter `nav.ts` to write, or undefined when the app has one. */
  nav: [string, string] | undefined;
  install: { command: string; args: string[] } | undefined;
};

const RECIPE_FIX = "fix the recipe's recipe.json.";

/** Reads and checks the manifest's `dependencies` and `templates`. */
function readManifest(recipeDir: string) {
  let manifest: unknown;
  try {
    manifest = JSON.parse(readFileSync(join(recipeDir, "recipe.json"), "utf8"));
  } catch {
    throw new Refusal(`The recipe's manifest is not valid JSON: ${RECIPE_FIX}`);
  }
  if (!isRecord(manifest)) {
    throw new Refusal(`The recipe's manifest is not an object: ${RECIPE_FIX}`);
  }
  const dependencies = manifest.dependencies ?? {};
  const templates = manifest.templates ?? {};
  if (!isRecord(dependencies) || !isRecord(templates)) {
    throw new Refusal(
      `The recipe's manifest has a dependencies or templates field that is not an object: ${RECIPE_FIX}`,
    );
  }
  const deps: [string, string][] = [];
  for (const [name, range] of Object.entries(dependencies)) {
    if (
      name.length > 214 ||
      !PACKAGE_NAME.test(name) ||
      typeof range !== "string" ||
      range.startsWith("-") ||
      !RANGE.test(range)
    ) {
      throw new Refusal(
        `The recipe's manifest gives the dependency ${q(name)} the range ${JSON.stringify(range)}, which add will not pass to a package manager: ${RECIPE_FIX}`,
      );
    }
    deps.push([name, range]);
  }
  const maps: [string, string][] = [];
  for (const [key, dest] of Object.entries(templates)) {
    if (typeof dest !== "string") {
      throw new Refusal(
        `The recipe's manifest maps ${q(key)} to something that is not a path: ${RECIPE_FIX}`,
      );
    }
    maps.push([key, dest]);
  }
  return { deps, templates: maps };
}

/** Every check `add` makes, in order. Throws a `Refusal`; writes nothing. */
function planAdd(
  recipe: string,
  root: string,
  { recipesRoot, repoRoot }: Pick<CliIo, "recipesRoot" | "repoRoot">,
): Plan {
  const recipes = listRecipes(recipesRoot);
  if (!recipes.includes(recipe)) {
    throw new Refusal(
      `There is no recipe named ${q(recipe)}: choose one of ${recipes.map(q).join(", ")}.`,
    );
  }

  // The app.
  const at = q(root);
  const packagePath = join(root, "package.json");
  if (!lstatSync(packagePath, NO_THROW)?.isFile()) {
    throw new Refusal(
      `There is no package.json in ${at}: run add from the root of a Next.js app, or pass --cwd <dir>.`,
    );
  }
  let pkg: unknown;
  try {
    pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  } catch {
    throw new Refusal(
      `The package.json in ${at} is not valid JSON: fix it, then run add again.`,
    );
  }
  const lists = (field: string) =>
    isRecord(pkg) && isRecord(pkg[field]) && "next" in pkg[field];
  if (!lists("dependencies") && !lists("devDependencies")) {
    throw new Refusal(
      `The package.json in ${at} does not list next in dependencies or devDependencies: add the recipe to a Next.js app.`,
    );
  }
  if (!isDirectory(join(root, "app"))) {
    if (isDirectory(join(root, "src/app"))) {
      throw new Refusal(
        `${at} keeps its app in src/app, which add does not support: add the recipe to an app with app/ at its root.`,
      );
    }
    if (isDirectory(join(root, "pages"))) {
      throw new Refusal(
        `${at} uses the Pages Router (pages/ with no app/), which add does not support: add the recipe to an App Router app.`,
      );
    }
    throw new Refusal(
      `${at} has no app/ directory at its root: add the recipe to a Next.js App Router app.`,
    );
  }
  const tsconfigPath = join(root, "tsconfig.json");
  if (!lstatSync(tsconfigPath, NO_THROW)?.isFile()) {
    throw new Refusal(
      `There is no tsconfig.json in ${at}: add the recipe to a TypeScript Next.js app.`,
    );
  }
  let tsconfig: unknown;
  try {
    tsconfig = parseJsonc(readFileSync(tsconfigPath, "utf8"));
  } catch {
    throw new Refusal(
      `The tsconfig.json in ${at} cannot be read as JSON with comments: fix it, then run add again.`,
    );
  }
  // `extends` is not followed: the alias must be in this file.
  const options = isRecord(tsconfig) ? tsconfig.compilerOptions : undefined;
  const paths = isRecord(options) ? options.paths : undefined;
  const alias = isRecord(paths) ? paths["@/*"] : undefined;
  if (!Array.isArray(alias) || alias[0] !== "./*") {
    throw new Refusal(
      `The tsconfig.json in ${at} has no "@/*" path whose first target is "./*": add "paths": { "@/*": ["./*"] } to its compilerOptions, then run add again.`,
    );
  }

  // The recipe.
  const recipeDir = join(recipesRoot, recipe);
  const filesDir = join(recipeDir, "files");
  const templatesDir = join(recipeDir, "templates");
  const manifest = readManifest(recipeDir);
  const sources = checked(() => listRecipeFiles(filesDir));

  const destinations = new Map<string, string>();
  const claim = (dest: string) => {
    if (isProtected(dest)) {
      throw new Refusal(
        `The recipe would write ${q(dest)}, which add never writes: remove it from the recipe.`,
      );
    }
    const key = dest.toLowerCase();
    if (destinations.has(key)) {
      throw new Refusal(
        `The recipe's manifest maps more than one file to ${q(dest)}: ${RECIPE_FIX}`,
      );
    }
    destinations.set(key, dest);
  };
  for (const file of sources) {
    checked(() => checkRelativePath(file));
    claim(file);
  }
  for (const [key, dest] of manifest.templates) {
    try {
      checkRelativePath(key);
      if (!lstatSync(safeTarget(templatesDir, key), NO_THROW)?.isFile()) {
        throw new Error("not a file");
      }
    } catch {
      throw new Refusal(
        `The recipe's manifest lists the template ${q(key)}, which is not a regular file inside templates/: ${RECIPE_FIX}`,
      );
    }
    try {
      checkRelativePath(dest);
    } catch {
      throw new Refusal(
        `The recipe's manifest maps ${q(key)} to ${q(dest)}, which is not a plain relative path inside the app: ${RECIPE_FIX}`,
      );
    }
    claim(dest);
  }
  const navDest = manifest.templates.find(([key]) => key === "nav.ts")?.[1];
  if (navDest === undefined) {
    throw new Refusal(
      `The recipe's manifest has no "nav.ts" template: ${RECIPE_FIX}`,
    );
  }
  if (navDest !== "nav.ts") {
    throw new Refusal(
      `The recipe's manifest maps the template "nav.ts" to ${q(navDest)}, but add writes it only to "nav.ts": ${RECIPE_FIX}`,
    );
  }

  // Every destination, against the app as it is now.
  const blocked = new Set<string>();
  const files: Plan["files"] = [];
  for (const file of sources) {
    const target = checked(() => safeTarget(root, file));
    const segments = file.split("/");
    for (let k = 1; k < segments.length; k++) {
      const dir = segments.slice(0, k).join("/");
      if (exists(join(root, dir)) && !isDirectory(join(root, dir))) {
        blocked.add(dir);
      }
    }
    if (exists(target)) blocked.add(file);
    files.push([join(filesDir, file), target, file]);
  }
  if (blocked.size > 0) {
    throw new Refusal(
      `These files already exist, so add wrote nothing: ${[...blocked].sort().map(q).join(", ")}; move or delete them, then run add again.`,
    );
  }
  const navTarget = checked(() => safeTarget(root, "nav.ts", { leaf: false }));
  const nav: Plan["nav"] = exists(navTarget)
    ? undefined
    : [join(templatesDir, "nav.ts"), checked(() => safeTarget(root, "nav.ts"))];

  // The install.
  if (manifest.deps.length === 0)
    return { root, files, nav, install: undefined };
  const workspace = workspaceRootOf(root, repoRoot);
  const unpublished = manifest.deps
    .filter(([, range]) => range.startsWith("workspace:"))
    .map(([name]) => q(name));
  if (unpublished.length > 0 && !workspace) {
    const names =
      unpublished.length === 1
        ? unpublished[0]
        : `${unpublished.slice(0, -1).join(", ")} and ${unpublished[unpublished.length - 1]}`;
    throw new Refusal(
      `The recipe's manifest has no published range yet for ${names}, only a workspace: range that resolves inside the UIID repository alone, so add cannot install ${unpublished.length === 1 ? "it" : "them"} here.`,
    );
  }
  // A workspace member has no lockfile of its own: it is the workspace's.
  const lockDir = workspace ?? root;
  const managers = [
    ...new Set(
      [...LOCKFILES]
        .filter(([name]) => lstatSync(join(lockDir, name), NO_THROW)?.isFile())
        .map(([, manager]) => manager),
    ),
  ];
  if (managers.length === 0) {
    throw new Refusal(
      `${q(lockDir)} has no lockfile at its root (pnpm-lock.yaml, package-lock.json, yarn.lock, bun.lock or bun.lockb): install the app's dependencies once with its package manager, then run add again.`,
    );
  }
  if (managers.length > 1) {
    throw new Refusal(
      `${q(lockDir)} has lockfiles for more than one package manager (${managers.join(", ")}): delete the ones the app does not use, then run add again.`,
    );
  }
  const command = managers[0];
  return {
    root,
    files,
    nav,
    install: {
      command,
      args: [
        INSTALL_VERB[command],
        ...manifest.deps.map(([name, range]) => `${name}@${range}`),
      ],
    },
  };
}

type Parsed =
  | { help: true }
  | { help: false; recipe: string; cwd: string | undefined; dryRun: boolean };

function parseArgs(argv: string[]): Parsed {
  if (argv.includes("--help") || argv.includes("-h")) return { help: true };
  const positional: string[] = [];
  let cwd: string | undefined;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--cwd") {
      const value = argv[++i];
      if (value === undefined || value === "") {
        throw new Refusal(`--cwd needs a directory: pass --cwd <dir>.`);
      }
      cwd = value;
    } else if (arg.startsWith("--cwd=")) {
      cwd = arg.slice("--cwd=".length);
      if (!cwd) throw new Refusal(`--cwd needs a directory: pass --cwd <dir>.`);
    } else if (arg.startsWith("-")) {
      throw new Refusal(
        `Unknown option ${q(arg)}: run uiid-recipes --help to see the options.`,
      );
    } else positional.push(arg);
  }
  const [command, recipe, ...rest] = positional;
  if (command === undefined) {
    throw new Refusal(
      `Name a command: run uiid-recipes --help to see the commands.`,
    );
  }
  if (command !== "add") {
    throw new Refusal(
      `Unknown command ${q(command)}: run uiid-recipes --help to see the commands.`,
    );
  }
  if (recipe === undefined) {
    throw new Refusal(
      `Name the recipe to add: run uiid-recipes add <recipe>, such as uiid-recipes add app-shell.`,
    );
  }
  if (rest.length > 0) {
    throw new Refusal(
      `Unexpected argument ${q(rest[0])}: add takes one recipe.`,
    );
  }
  return { help: false, recipe, cwd, dryRun };
}

/** The app's real root, from `--cwd` or the current directory. */
function resolveRoot(cwd: string, flag: string | undefined): string {
  const dir = resolve(cwd, flag ?? ".");
  const stat = statSync(dir, NO_THROW);
  if (!stat) {
    throw new Refusal(
      `--cwd ${q(dir)} does not exist: pass the directory of an existing Next.js app.`,
    );
  }
  if (!stat.isDirectory()) {
    throw new Refusal(
      `--cwd ${q(dir)} is not a directory: pass the directory of an existing Next.js app.`,
    );
  }
  return realpathSync(dir);
}

/** The whole command: parses `argv`, runs `add`, and returns the exit code. */
export function runCli(argv: string[], io: CliIo): number {
  let plan: Plan;
  let dryRun: boolean;
  try {
    const parsed = parseArgs(argv);
    if (parsed.help) {
      io.log(USAGE);
      return 0;
    }
    dryRun = parsed.dryRun;
    plan = planAdd(parsed.recipe, resolveRoot(io.cwd, parsed.cwd), io);
  } catch (error) {
    io.error(
      error instanceof Refusal
        ? error.message
        : `add stopped before writing anything, because ${(error as Error).message}: fix that, then run add again.`,
    );
    return 1;
  }

  const show = (path: string) => q(posix.join(...path.split(sep)));
  const commandLine = plan.install
    ? [plan.install.command, ...plan.install.args].map(shellWord).join(" ")
    : undefined;

  if (dryRun) {
    io.log(
      `uiid-recipes add --dry-run: nothing was written in ${q(plan.root)}`,
    );
    for (const [, , file] of plan.files) io.log(`  would write ${show(file)}`);
    io.log(plan.nav ? `  would write "nav.ts"` : `  would keep  "nav.ts"`);
    if (commandLine) io.log(`  would run   ${commandLine}`);
    return 0;
  }

  // Exclusive creates: a file that appeared since the checks stops the copy
  // instead of being replaced.
  const writes: [string, string, string][] = [...plan.files];
  if (plan.nav) writes.push([...plan.nav, "nav.ts"]);
  for (const [source, target, file] of writes) {
    try {
      copyFiles([[source, target]], { exclusive: true });
    } catch (error) {
      io.error(
        `add stopped while writing ${show(file)} (${(error as Error).message}): the files listed as wrote are in place, so delete them or finish by hand.`,
      );
      return 1;
    }
    io.log(`  wrote    ${show(file)}`);
  }
  if (!plan.nav) io.log(`  kept     "nav.ts"`);

  if (plan.install && commandLine) {
    io.log(`  running  ${commandLine}`);
    let status: number;
    try {
      status = io.run(plan.install.command, plan.install.args, plan.root);
    } catch {
      status = 1;
    }
    if (status !== 0) {
      io.error(
        `The recipe's files are in place, but the install failed: run ${commandLine} in ${q(plan.root)} by hand.`,
      );
      return 1;
    }
  }
  io.log(`\nuiid-recipes add: added the recipe to ${q(plan.root)}\n`);
  io.log(LAYOUT_WIRING);
  return 0;
}
