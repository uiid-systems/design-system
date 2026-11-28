/**
 * `uiid-recipes add <recipe>`: copies a recipe into a Next.js app that already
 * exists. `cli.ts` parses the command line and calls `runAdd` here. The
 * checks and the writes are exported, because `create` runs the same steps on
 * the app it scaffolds.
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

/** The command a sentence names: the shared checks speak for whichever runs them. */
export type Command = "add" | "create";

/**
 * A refusal: one sentence saying what failed and what to do. `problem` is the
 * failed condition alone, for a caller that says what to do itself.
 */
export class Refusal extends Error {
  readonly problem: string;
  constructor(message: string, problem = message.replace(/\.$/, "")) {
    super(message);
    this.problem = problem;
  }
}

/** A refusal whose sentence is the problem, then what to do. */
const refusal = (problem: string, fix: string) =>
  new Refusal(`${problem}: ${fix}.`, problem);

const NO_THROW = { throwIfNoEntry: false } as const;
export const q = (value: string) => JSON.stringify(value);
/** A path relative to the app, printed as a JSON string. */
export const show = (path: string) => q(posix.join(...path.split(sep)));

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

/** Lockfiles at an app's root, and the package manager each belongs to. */
export const LOCKFILES = new Map([
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
 * The only ranges add passes on: a plain semver version or range with no
 * protocol (an optional `^` or `~`, one to three numbers joined by dots, an
 * optional prerelease), or `workspace:` followed by `*`, `^` or `~`. Anything
 * else, such as a dist-tag, a URL, `git+…`, `github:`, `file:`, `link:`, an
 * `npm:` alias or a comparator range, could install other code under the
 * dependency's name, so it is refused.
 */
const RANGE =
  /^(?:[\^~]?\d+(?:\.\d+){0,2}(?:-[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)*)?|workspace:[*^~])$/;

/** An argument printed for a person to paste, quoted when it holds more than plain characters. */
export const shellWord = (arg: string) =>
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

export const isRecord = (value: unknown): value is Record<string, unknown> =>
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
export function workspaceRootOf(
  target: string,
  repoRoot: string,
): string | undefined {
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

/**
 * An error as text that is safe to print: a file system error becomes its
 * code and its path through `JSON.stringify`, never Node's message, which
 * quotes the path raw. The errors `recipes.ts` throws already stringify
 * every path, so their message is kept.
 */
export function describe(error: unknown): string {
  const { code, path } = (error ?? {}) as { code?: unknown; path?: unknown };
  if (typeof code === "string") {
    return typeof path === "string" ? `${code} at ${q(path)}` : code;
  }
  return error instanceof Error ? error.message : q(String(error));
}

/** A check on the app from `recipes.ts`, such as a symlink, turned into one sentence. */
function checkedApp<T>(cmd: Command, check: () => T): T {
  try {
    return check();
  } catch (error) {
    throw new Refusal(
      `${describe(error)}, so ${cmd} wrote nothing: replace it with a real directory or file, then run ${cmd} again.`,
      describe(error),
    );
  }
}

/** A check on the recipe's own files from `recipes.ts`, turned into one sentence. */
function checkedRecipe<T>(cmd: Command, check: () => T): T {
  try {
    return check();
  } catch (error) {
    throw new Refusal(
      `${describe(error)}, so ${cmd} wrote nothing: fix the recipe's files/ directory.`,
    );
  }
}

/** A recipe whose manifest and files passed every check. */
export type Recipe = {
  filesDir: string;
  templatesDir: string;
  /** Every file under `files/`, as a path relative to the app. */
  sources: string[];
  /** `[template, destination]` for each template, in manifest order. */
  templates: [string, string][];
  /** `[name, range]` for each dependency, in manifest order. */
  deps: [string, string][];
};

/** One file to write: its source, and its path relative to the app. */
export type Write = { source: string; file: string };

export type Install = { command: string; args: string[] };

const RECIPE_FIX = "fix the recipe's recipe.json.";

/** Reads and checks the manifest's `dependencies` and `templates`. */
function readManifest(recipeDir: string, cmd: Command) {
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
      !RANGE.test(range)
    ) {
      throw new Refusal(
        `The recipe's manifest gives the dependency ${q(name)} the range ${JSON.stringify(range)}, which ${cmd} will not pass to a package manager: ${RECIPE_FIX}`,
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

/**
 * Every check on the recipe itself, which needs no app: the recipe exists,
 * its manifest is data `cmd` can trust, and every destination, from `files/`
 * or a template, is a plain relative path that is not protected, not at the
 * app root for `files/`, and claimed once. Throws a `Refusal`.
 */
export function readRecipe(
  recipe: string,
  recipesRoot: string,
  cmd: Command,
): Recipe {
  const recipes = listRecipes(recipesRoot);
  if (!recipes.includes(recipe)) {
    throw new Refusal(
      `There is no recipe named ${q(recipe)}: choose one of ${recipes.map(q).join(", ")}.`,
    );
  }

  const recipeDir = join(recipesRoot, recipe);
  const filesDir = join(recipeDir, "files");
  const templatesDir = join(recipeDir, "templates");
  const manifest = readManifest(recipeDir, cmd);
  const sources = checkedRecipe(cmd, () => listRecipeFiles(filesDir));

  const destinations = new Set<string>();
  const claim = (dest: string, from: "files" | "templates") => {
    if (isProtected(dest)) {
      throw new Refusal(
        `The recipe would write ${q(dest)}, which ${cmd} never writes: remove it from the recipe.`,
      );
    }
    const key = dest.toLowerCase();
    if (destinations.has(key)) {
      throw new Refusal(
        from === "files"
          ? `The recipe's files/ holds more than one file named ${q(dest)} when case is ignored: rename or remove one in the recipe.`
          : `The recipe's manifest maps more than one file to ${q(dest)}: ${RECIPE_FIX}`,
      );
    }
    destinations.add(key);
  };
  for (const file of sources) {
    checkedRecipe(cmd, () => checkRelativePath(file));
    claim(file, "files");
    // A file at the app root could be package-manager config, read by the
    // install that runs next. Recipe files always live in a directory.
    if (!file.includes("/")) {
      throw new Refusal(
        `The recipe would write ${q(file)} directly at the app root, which ${cmd} never does: move it into a directory in the recipe's files/.`,
      );
    }
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
    claim(dest, "templates");
  }
  return {
    filesDir,
    templatesDir,
    sources,
    templates: manifest.templates,
    deps: manifest.deps,
  };
}

/**
 * The checks that make `root` an app the recipe fits: a Next.js App Router
 * app with TypeScript, the `@/*` alias and no `baseUrl` elsewhere. Throws a
 * `Refusal`; reads only.
 */
export function checkApp(root: string, cmd: Command): void {
  const at = q(root);
  for (const name of ["package.json", "app", "tsconfig.json"]) {
    if (lstatSync(join(root, name), NO_THROW)?.isSymbolicLink()) {
      throw refusal(
        `${q(name)} in ${at} is a symlink, which ${cmd} does not follow`,
        `replace it with the real ${name === "app" ? "directory" : "file"}, then run ${cmd} again`,
      );
    }
  }
  const packagePath = join(root, "package.json");
  if (!lstatSync(packagePath, NO_THROW)?.isFile()) {
    throw refusal(
      `There is no package.json in ${at}`,
      `run ${cmd} from the root of a Next.js app, or pass --cwd <dir>`,
    );
  }
  let pkg: unknown;
  try {
    pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  } catch {
    throw refusal(
      `The package.json in ${at} is not valid JSON`,
      `fix it, then run ${cmd} again`,
    );
  }
  const lists = (field: string) =>
    isRecord(pkg) && isRecord(pkg[field]) && "next" in pkg[field];
  if (!lists("dependencies") && !lists("devDependencies")) {
    throw refusal(
      `The package.json in ${at} does not list next in dependencies or devDependencies`,
      "add the recipe to a Next.js app",
    );
  }
  if (!isDirectory(join(root, "app"))) {
    if (isDirectory(join(root, "src/app"))) {
      throw refusal(
        `${at} keeps its app in src/app, which ${cmd} does not support`,
        "add the recipe to an app with app/ at its root",
      );
    }
    if (isDirectory(join(root, "pages"))) {
      throw refusal(
        `${at} uses the Pages Router (pages/ with no app/), which ${cmd} does not support`,
        "add the recipe to an App Router app",
      );
    }
    throw refusal(
      `${at} has no app/ directory at its root`,
      "add the recipe to a Next.js App Router app",
    );
  }
  const tsconfigPath = join(root, "tsconfig.json");
  if (!lstatSync(tsconfigPath, NO_THROW)?.isFile()) {
    throw refusal(
      `There is no tsconfig.json in ${at}`,
      "add the recipe to a TypeScript Next.js app",
    );
  }
  let tsconfig: unknown;
  try {
    tsconfig = parseJsonc(readFileSync(tsconfigPath, "utf8"));
  } catch {
    throw refusal(
      `The tsconfig.json in ${at} cannot be read as JSON with comments`,
      `fix it, then run ${cmd} again`,
    );
  }
  // `extends` is not followed: the alias must be in this file.
  const options = isRecord(tsconfig) ? tsconfig.compilerOptions : undefined;
  const paths = isRecord(options) ? options.paths : undefined;
  const alias = isRecord(paths) ? paths["@/*"] : undefined;
  if (!Array.isArray(alias) || alias[0] !== "./*") {
    throw refusal(
      `The tsconfig.json in ${at} has no "@/*" path whose first target is "./*"`,
      `add "paths": { "@/*": ["./*"] } to its compilerOptions, then run ${cmd} again`,
    );
  }
  // `paths` resolve from `baseUrl` when it is set, so it must be the root.
  const baseUrl = isRecord(options) ? options.baseUrl : undefined;
  if (
    baseUrl !== undefined &&
    (typeof baseUrl !== "string" || resolve(root, baseUrl) !== root)
  ) {
    throw refusal(
      `The tsconfig.json in ${at} sets baseUrl to ${JSON.stringify(baseUrl)}, so "@/*" does not resolve from the app root`,
      `remove baseUrl or set it to ".", then run ${cmd} again`,
    );
  }
}

/**
 * Checks the directories on the way to `file` in `root` from the top, since
 * below a file `lstat` throws ENOTDIR. A symlink is left to `safeTarget`.
 */
function checkDirectoriesOnTheWay(root: string, file: string, cmd: Command) {
  const segments = file.split("/");
  for (let k = 1; k < segments.length; k++) {
    const dir = segments.slice(0, k).join("/");
    const stat = lstatSync(join(root, dir), NO_THROW);
    if (!stat || stat.isSymbolicLink()) break;
    if (!stat.isDirectory()) {
      throw refusal(
        `${q(dir)} in ${q(root)} is a file where the recipe needs a directory`,
        `move or rename it, then run ${cmd} again`,
      );
    }
  }
}

/**
 * Checks that each of `writes` can be created in `root` as it is now: no
 * symlink on the way, no file where a directory goes, and nothing at the
 * destination. Lists every destination that exists. Throws a `Refusal`.
 */
export function checkNewFiles(
  root: string,
  writes: Write[],
  cmd: Command,
): void {
  const blocked: string[] = [];
  for (const { file } of writes) {
    checkDirectoriesOnTheWay(root, file, cmd);
    if (exists(checkedApp(cmd, () => safeTarget(root, file)))) {
      blocked.push(file);
    }
  }
  if (blocked.length > 0) {
    const list = blocked.sort().map(q).join(", ");
    throw new Refusal(
      `These files already exist, so ${cmd} wrote nothing: ${list}; move or delete them, then run ${cmd} again.`,
      `These files already exist: ${list}`,
    );
  }
}

/**
 * Checks that `file` in `root` is a regular file that may be replaced, with
 * no symlink at it or on the way to it. Throws a `Refusal`.
 */
export function checkReplaceable(
  root: string,
  file: string,
  cmd: Command,
): void {
  checkDirectoriesOnTheWay(root, file, cmd);
  const target = checkedApp(cmd, () => safeTarget(root, file));
  if (!lstatSync(target, NO_THROW)?.isFile()) {
    throw refusal(
      `There is no regular file at ${q(file)} in ${q(root)} to replace`,
      `run ${cmd} again`,
    );
  }
}

/**
 * The workspace root when `root` is a member of this repository's workspace.
 * Refuses a `workspace:` range anywhere else, since it would not install.
 */
export function workspaceFor(
  root: string,
  deps: [string, string][],
  repoRoot: string,
  cmd: Command,
): string | undefined {
  const workspace = workspaceRootOf(root, repoRoot);
  const unpublished = deps
    .filter(([, range]) => range.startsWith("workspace:"))
    .map(([name]) => q(name));
  if (unpublished.length > 0 && !workspace) {
    const names =
      unpublished.length === 1
        ? unpublished[0]
        : `${unpublished.slice(0, -1).join(", ")} and ${unpublished[unpublished.length - 1]}`;
    const them = unpublished.length === 1 ? "it" : "them";
    throw new Refusal(
      cmd === "add"
        ? `The recipe's manifest has no published range yet for ${names}, only a workspace: range that resolves inside the UIID repository alone, so add cannot install ${them} here: run add in an app inside the UIID repository's workspace until the recipe has a published range.`
        : `The recipe's manifest has no published range yet for ${names}, only a workspace: range that resolves inside the UIID repository alone, so create cannot install ${them} in ${q(root)}: name a directory inside the UIID repository's workspace until the recipe has a published range.`,
    );
  }
  return workspace;
}

/** The one package manager whose lockfile sits at `lockDir`'s root. Throws a `Refusal`. */
export function packageManagerAt(lockDir: string, cmd: Command): string {
  const managers = [
    ...new Set(
      [...LOCKFILES]
        .filter(([name]) => lstatSync(join(lockDir, name), NO_THROW)?.isFile())
        .map(([, manager]) => manager),
    ),
  ];
  if (managers.length === 0) {
    throw refusal(
      `${q(lockDir)} has no lockfile at its root (pnpm-lock.yaml, package-lock.json, yarn.lock, bun.lock or bun.lockb)`,
      `install the app's dependencies once with its package manager, then run ${cmd} again`,
    );
  }
  if (managers.length > 1) {
    throw refusal(
      `${q(lockDir)} has lockfiles for more than one package manager (${managers.join(", ")})`,
      `delete the ones the app does not use, then run ${cmd} again`,
    );
  }
  return managers[0];
}

/** The install of `deps` with `manager`, or undefined when there is nothing to install. */
export function installOf(
  manager: string,
  deps: [string, string][],
): Install | undefined {
  if (deps.length === 0) return undefined;
  return {
    command: manager,
    args: [
      INSTALL_VERB[manager],
      ...deps.map(([name, range]) => `${name}@${range}`),
    ],
  };
}

/** A command as a person would paste it. */
export const commandLine = ({ command, args }: Install) =>
  [command, ...args].map(shellWord).join(" ");

/**
 * Writes each file into `root` and logs it. A new file is created
 * exclusively, so one that appeared since the checks stops the copy instead
 * of being replaced; a file in `replace` is overwritten, and must still be a
 * regular file. Each target is checked again right before its write, so a
 * directory on the way that became a symlink since planning is refused, not
 * followed. Returns the write that failed, or undefined.
 */
export function writeFiles(
  root: string,
  writes: Write[],
  log: (line: string) => void,
  replace: ReadonlySet<string> = new Set(),
): { file: string; error: unknown } | undefined {
  for (const { source, file } of writes) {
    const replacing = replace.has(file);
    try {
      const target = safeTarget(root, file);
      if (replacing && !lstatSync(target, NO_THROW)?.isFile()) {
        throw new Error(`${q(target)} is no longer a regular file`);
      }
      copyFiles([[source, target]], { exclusive: !replacing });
    } catch (error) {
      return { file, error };
    }
    log(`  ${replacing ? "replaced" : "wrote   "} ${show(file)}`);
  }
  return undefined;
}

/** Runs an install, counting a runner that throws as a failure. */
export function runInstall(install: Install, root: string, io: CliIo): boolean {
  io.log(`  running  ${commandLine(install)}`);
  try {
    return io.run(install.command, install.args, root) === 0;
  } catch {
    return false;
  }
}

type Plan = {
  root: string;
  files: Write[];
  /** The starter `nav.ts` to write, or undefined when the app has one. */
  nav: Write | undefined;
  install: Install | undefined;
};

/** Every check `add` makes, in order. Throws a `Refusal`; writes nothing. */
function planAdd(
  recipeName: string,
  root: string,
  { recipesRoot, repoRoot }: Pick<CliIo, "recipesRoot" | "repoRoot">,
): Plan {
  // Unknown recipes are refused before the app is read.
  const recipe = readRecipe(recipeName, recipesRoot, "add");
  checkApp(root, "add");

  const navDest = recipe.templates.find(([key]) => key === "nav.ts")?.[1];
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
  const files = recipe.sources.map((file) => ({
    source: join(recipe.filesDir, file),
    file,
  }));
  checkNewFiles(root, files, "add");
  const navTarget = checkedApp("add", () =>
    safeTarget(root, "nav.ts", { leaf: false }),
  );
  let nav: Write | undefined;
  if (!exists(navTarget)) {
    checkedApp("add", () => safeTarget(root, "nav.ts"));
    nav = { source: join(recipe.templatesDir, "nav.ts"), file: "nav.ts" };
  }

  // The install.
  if (recipe.deps.length === 0) return { root, files, nav, install: undefined };
  // A workspace member has no lockfile of its own: it is the workspace's.
  const workspace = workspaceFor(root, recipe.deps, repoRoot, "add");
  const manager = packageManagerAt(workspace ?? root, "add");
  return { root, files, nav, install: installOf(manager, recipe.deps) };
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

/** `add`: plans, writes, installs, and returns the exit code. */
export function runAdd(
  recipe: string,
  cwd: string | undefined,
  dryRun: boolean,
  io: CliIo,
): number {
  let plan: Plan;
  try {
    plan = planAdd(recipe, resolveRoot(io.cwd, cwd), io);
  } catch (error) {
    io.error(
      error instanceof Refusal
        ? error.message
        : `add stopped before writing anything, because of ${describe(error)}: fix that, then run add again.`,
    );
    return 1;
  }

  if (dryRun) {
    io.log(
      `uiid-recipes add --dry-run: nothing was written in ${q(plan.root)}`,
    );
    for (const { file } of plan.files) io.log(`  would write ${show(file)}`);
    io.log(plan.nav ? `  would write "nav.ts"` : `  would keep  "nav.ts"`);
    if (plan.install) io.log(`  would run   ${commandLine(plan.install)}`);
    return 0;
  }

  const writes = plan.nav ? [...plan.files, plan.nav] : plan.files;
  const failed = writeFiles(plan.root, writes, io.log);
  if (failed) {
    io.error(
      `add stopped while writing ${show(failed.file)} (${describe(failed.error)}): the files listed as wrote are in place, so delete them or finish by hand.`,
    );
    return 1;
  }
  if (!plan.nav) io.log(`  kept     "nav.ts"`);

  // Before the install, so a failed install still shows it.
  io.log(`\n${LAYOUT_WIRING}\n`);

  if (plan.install && !runInstall(plan.install, plan.root, io)) {
    io.error(
      `The recipe's files are in place, but the install failed: run ${commandLine(plan.install)} in ${q(plan.root)} by hand.`,
    );
    return 1;
  }
  io.log(`uiid-recipes add: added the recipe to ${q(plan.root)}`);
  return 0;
}
