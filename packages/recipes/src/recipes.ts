/**
 * Keeps a project's copy of a recipe identical to the recipe's `files/`.
 *
 * Plain Node with no dependencies: Node runs this TypeScript directly by
 * stripping its types, so it uses erasable syntax only and imports with `.ts`.
 *
 * A file or directory whose name starts with `.` is never part of the recipe
 * or of the project's copy: the walk skips it on both sides.
 *
 * Ownership: a recipe owns the topmost directories under `files/` that
 * directly hold a file (today `components/shell`, `components/sidebar`,
 * `components/header`, `components/main`, `components/breadcrumbs` and `lib`).
 * A directory the recipe only passes through, such as `components/` or the
 * root, is never owned. A file directly under `files/` is compared on its own.
 *
 * Inside an owned directory of the project's copy, a file the recipe does not
 * have is extra when its directory is one the recipe has, and sync deletes it.
 * A directory the recipe does not have is reported instead, and sync refuses
 * to run while one exists: a person deletes it.
 */
import {
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  posix,
  relative,
  resolve,
  sep,
} from "node:path";

export type RecipeDiff = {
  /** In both, with different contents. */
  changed: string[];
  /** In the recipe, not in the destination under that exact name. */
  missing: string[];
  /** Files in a destination directory the recipe has, that the recipe does not. */
  extra: string[];
  /** Topmost directories inside an owned directory that the recipe does not have. */
  extraDirectories: string[];
};

export type SyncResult = {
  /** Files copied from the recipe, because they were changed or missing. */
  written: string[];
  /** Extra files deleted. */
  removed: string[];
};

export type ImportViolation = { file: string; specifier: string };

export type Labels = { files: string; dest: string };
export type Log = (line: string) => void;

const NO_THROW = { throwIfNoEntry: false } as const;

/**
 * Resolves `path`, relative to `root`, and refuses anything that is not a
 * relative path landing strictly inside the root: an absolute path, `..`
 * segments that climb out, or the root itself.
 */
export function resolveInside(root: string, path: string): string {
  const base = resolve(root);
  const target = resolve(base, path);
  const rel = relative(base, target);
  if (
    isAbsolute(path) ||
    !rel ||
    rel === ".." ||
    rel.startsWith(`..${sep}`) ||
    isAbsolute(rel)
  ) {
    throw new Error(
      `Refusing ${JSON.stringify(path)}: it is absolute or resolves outside ${JSON.stringify(base)}`,
    );
  }
  return target;
}

/**
 * Throws when `path` exists and is a symlink. The path is resolved first, so
 * a trailing slash cannot make `lstat` follow the link.
 */
function refuseSymlink(path: string) {
  const resolved = resolve(path);
  if (lstatSync(resolved, NO_THROW)?.isSymbolicLink()) {
    throw new Error(
      `Refusing to follow the symlink at ${JSON.stringify(resolved)}`,
    );
  }
}

/**
 * Resolves a destination path inside `root` and refuses it when the root, the
 * target or any directory between them is a symlink, so nothing is read,
 * written or deleted through a link that points elsewhere. With `leaf: false`
 * the target itself may be a link, for a caller that only inspects it.
 */
function safeTarget(root: string, path: string, { leaf = true } = {}): string {
  const target = resolveInside(root, path);
  let current = resolve(root);
  refuseSymlink(current);
  const segments = relative(current, target).split(sep);
  if (!leaf) segments.pop();
  for (const segment of segments) {
    current = join(current, segment);
    refuseSymlink(current);
  }
  return target;
}

/**
 * Every entry under `dir` that is not a directory, as sorted POSIX paths
 * relative to it. Skips any file or directory whose name starts with `.`, and
 * never follows a symlink: a symlink is listed as an entry of its own. A
 * missing directory has no files.
 */
function walkFiles(dir: string): string[] {
  const found: string[] = [];
  const walk = (rel: string) => {
    for (const entry of readdirSync(join(dir, rel), { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const path = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path);
      else found.push(path);
    }
  };
  if (lstatSync(resolve(dir), NO_THROW)?.isDirectory()) walk("");
  return found.sort();
}

/**
 * The recipe's files. Refuses a symlinked `files/`, any file that is not a
 * regular file, and a recipe with no files, which is missing or misplaced.
 */
function listRecipeFiles(filesDir: string): string[] {
  refuseSymlink(filesDir);
  const files = walkFiles(filesDir);
  if (files.length === 0) {
    throw new Error(
      `The recipe at ${JSON.stringify(resolve(filesDir))} holds no files: it is missing, empty or misplaced`,
    );
  }
  for (const file of files) {
    if (!lstatSync(join(filesDir, file)).isFile()) {
      throw new Error(
        `Recipe files must be regular files: ${JSON.stringify(join(filesDir, file))}`,
      );
    }
  }
  return files;
}

/** The topmost directories, never the root, that directly hold one of `files`. */
export function ownedDirectories(files: string[]): string[] {
  const holders = [...new Set(files.map((file) => posix.dirname(file)))]
    .filter((dir) => dir !== ".")
    .sort();
  return holders.filter(
    (dir) =>
      !holders.some((other) => other !== dir && dir.startsWith(`${other}/`)),
  );
}

/** Every directory that holds a recipe file, with all of its ancestors. */
function recipeDirectories(files: string[]): Set<string> {
  const dirs = new Set<string>();
  for (const file of files) {
    for (let dir = posix.dirname(file); dir !== "."; dir = posix.dirname(dir)) {
      dirs.add(dir);
    }
  }
  return dirs;
}

/**
 * For `path`, an entry strictly inside the owned directory `owned`, the
 * topmost directory between them that is not in `dirs`, the recipe's
 * directories. Undefined when every directory on the way is the recipe's.
 */
export function extraDirectoryOf(
  path: string,
  owned: string,
  dirs: Set<string>,
): string | undefined {
  if (!path.startsWith(`${owned}/`)) {
    throw new Error(
      `${JSON.stringify(path)} is not inside ${JSON.stringify(owned)}`,
    );
  }
  let extra: string | undefined;
  for (let dir = posix.dirname(path); dir !== owned; dir = posix.dirname(dir)) {
    if (!dirs.has(dir)) extra = dir;
  }
  return extra;
}

/** Whether `path` exists under exactly its own name, whatever the file system's case rules. */
function existsExactly(path: string) {
  if (!lstatSync(path, NO_THROW)) return false;
  return readdirSync(dirname(path)).includes(basename(path));
}

/**
 * Compares the recipe in `filesDir` with its copy under `destDir`. A
 * destination file that is a symlink, or not a file, counts as changed; a
 * symlinked directory on the way to one is refused.
 */
export function compareRecipe(filesDir: string, destDir: string): RecipeDiff {
  const recipe = listRecipeFiles(filesDir);
  const inRecipe = new Set(recipe);
  const dirs = recipeDirectories(recipe);
  const diff: RecipeDiff = {
    changed: [],
    missing: [],
    extra: [],
    extraDirectories: [],
  };

  for (const file of recipe) {
    const target = safeTarget(destDir, file, { leaf: false });
    if (!existsExactly(target)) diff.missing.push(file);
    else if (
      !lstatSync(target).isFile() ||
      !readFileSync(join(filesDir, file)).equals(readFileSync(target))
    ) {
      diff.changed.push(file);
    }
  }

  const extraDirectories = new Set<string>();
  for (const owned of ownedDirectories(recipe)) {
    for (const entry of walkFiles(safeTarget(destDir, owned))) {
      const path = `${owned}/${entry}`;
      if (inRecipe.has(path)) continue;
      const extraDir = extraDirectoryOf(path, owned, dirs);
      if (extraDir) extraDirectories.add(extraDir);
      else diff.extra.push(path);
    }
  }
  diff.extra.sort();
  diff.extraDirectories = [...extraDirectories].sort();
  return diff;
}

/**
 * Makes `destDir`'s copy of the recipe identical to `filesDir`: deletes extra
 * files, then copies changed and missing ones. Refuses, changing nothing, when
 * the copy has a directory the recipe does not have. Every target is checked
 * before anything changes, and a symlink anywhere on a target's path stops the
 * sync.
 */
export function syncRecipe(filesDir: string, destDir: string): SyncResult {
  const diff = compareRecipe(filesDir, destDir);
  if (diff.extraDirectories.length > 0) {
    const names = diff.extraDirectories.map((dir) => JSON.stringify(`${dir}/`));
    throw new Error(
      `Refusing to sync: the copy has directories the recipe does not have, ` +
        `${names.join(", ")}. Delete or move them by hand, then sync again.`,
    );
  }
  const written = [...diff.changed, ...diff.missing].sort();
  const removals = diff.extra.map((file) => safeTarget(destDir, file));
  const writes = written.map((file) => [
    join(filesDir, file),
    safeTarget(destDir, file),
  ]);

  // Removals first: after a case-only rename on a case-insensitive file
  // system, the old name and the new one are the same file.
  for (const target of removals) unlinkSync(target);
  for (const [source, target] of writes) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, readFileSync(source));
  }

  return { written, removed: diff.extra };
}

/** `from "x"`, and a side-effect `import "x"`. */
const STATIC = /\b(?:from|import)\s*(["'`])([^"'`\n]*)\1/g;
/** The start of an `import(` or `require(` call. */
const CALL = /\b(import|require)\s*\(/g;
/** A call's argument when it is one string literal and nothing else. */
const CALL_LITERAL = /\s*(["'`])([^"'`\n]*)\1\s*\)/y;

/**
 * The module specifiers a source file names: static, type-only and
 * side-effect imports, re-exports, `import()` and `require()`. A specifier in
 * a comment or a string is found too, which can only make the check stricter.
 * A call whose argument is not one string literal, such as `import(name)` or
 * `import("./" + name)`, comes back as the call's text, such as
 * `import("./" + name`, which no rule allows.
 */
export function importSpecifiers(source: string): string[] {
  const found: { at: number; specifier: string }[] = [];
  for (const match of source.matchAll(STATIC)) {
    found.push({ at: match.index, specifier: match[2] });
  }
  for (const match of source.matchAll(CALL)) {
    const after = match.index + match[0].length;
    CALL_LITERAL.lastIndex = after;
    const literal = CALL_LITERAL.exec(source);
    found.push({
      at: match.index,
      specifier: literal
        ? literal[2]
        : `${match[1]}(${source.slice(after, after + 40).split("\n")[0]}`,
    });
  }
  return found.sort((a, b) => a.at - b.at).map(({ specifier }) => specifier);
}

/** Packages a recipe file may import, bare or through their own subpaths. */
const PACKAGES = ["react", "jotai", "@uiid/design-system"];
/** Packages a recipe file may import only through a subpath. */
const SUBPATH_PACKAGES = ["next", "@uiid/icons"];
/** The project's own modules a recipe file may import. */
const PROJECT_MODULES = ["@/nav", "@/lib/nav"];

/**
 * Whether `file`, a path under `files/`, may import `specifier`. The list is
 * `.claude/rules/recipes.md`'s: the packages above, `@/nav`, `@/lib/nav`,
 * another recipe directory through `@/components/...`, and a relative path
 * that stays inside the file's own recipe directory. A template literal with
 * `${`, or a non-relative specifier with a `.` or `..` segment, is refused.
 */
export function isAllowedImport(
  specifier: string,
  file: string,
  recipeDirectories: string[],
): boolean {
  if (specifier.includes("${")) return false;
  const inside = (path: string, dir: string) =>
    path === dir || path.startsWith(`${dir}/`);

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const own = recipeDirectories.find((dir) => inside(file, dir));
    const path = posix.normalize(posix.join(posix.dirname(file), specifier));
    return own !== undefined && inside(path, own);
  }

  if (
    specifier.split("/").some((segment) => segment === "." || segment === "..")
  ) {
    return false;
  }
  if (PACKAGES.some((name) => inside(specifier, name))) return true;
  if (SUBPATH_PACKAGES.some((name) => specifier.startsWith(`${name}/`))) {
    return true;
  }
  if (PROJECT_MODULES.includes(specifier)) return true;
  if (specifier.startsWith("@/components/")) {
    const path = specifier.slice(2);
    return recipeDirectories.some(
      (dir) => dir.startsWith("components/") && inside(path, dir),
    );
  }
  return false;
}

/**
 * Everything `recipes:check` fails on, one line per problem: each changed,
 * missing and extra file and each extra directory in the destination, then
 * each disallowed import in the recipe. Paths are printed as JSON strings, so
 * a control character in a file name cannot fake or hide a line. No lines
 * means the check passes.
 */
export function checkRecipe(
  filesDir: string,
  destDir: string,
  { labels = { files: filesDir, dest: destDir } }: { labels?: Labels } = {},
): string[] {
  const diff = compareRecipe(filesDir, destDir);
  const at = (file: string) => JSON.stringify(posix.join(labels.dest, file));
  return [
    ...diff.changed.map((file) => `changed  ${at(file)}`),
    ...diff.missing.map((file) => `missing  ${at(file)}`),
    ...diff.extra.map((file) => `extra    ${at(file)}`),
    ...diff.extraDirectories.map(
      (dir) =>
        `extra    ${at(`${dir}/`)}, a directory the recipe does not have`,
    ),
    ...findDisallowedImports(filesDir).map(
      ({ file, specifier }) =>
        `import   ${JSON.stringify(posix.join(labels.files, file))} imports ${JSON.stringify(specifier)}, which a recipe file may not import`,
    ),
  ];
}

type RunOptions = { labels?: Labels; log: Log };

/** `recipes:check`: logs the result and returns the exit code, 0 or 1. */
export function runCheck(
  filesDir: string,
  destDir: string,
  { labels = { files: filesDir, dest: destDir }, log }: RunOptions,
): number {
  let problems: string[];
  try {
    problems = checkRecipe(filesDir, destDir, { labels });
  } catch (error) {
    log(`recipes:check: ${(error as Error).message}`);
    return 1;
  }
  if (problems.length === 0) {
    log(`recipes:check: the copy in ${labels.dest} matches ${labels.files}`);
    return 0;
  }
  log(`recipes:check: ${problems.length} problem(s) with the recipe\n`);
  for (const line of problems) log(`  ${line}`);
  log(
    `\nEdit the recipe in ${labels.files}, then run \`pnpm recipes:sync\` to refresh the copy. ` +
      `Delete a directory the recipe does not have by hand.`,
  );
  return 1;
}

/** `recipes:sync`: syncs, logs what changed and returns the exit code, 0 or 1. */
export function runSync(
  filesDir: string,
  destDir: string,
  { labels = { files: filesDir, dest: destDir }, log }: RunOptions,
): number {
  let result: SyncResult;
  try {
    result = syncRecipe(filesDir, destDir);
  } catch (error) {
    log(`recipes:sync: ${(error as Error).message}`);
    return 1;
  }
  const at = (file: string) => JSON.stringify(posix.join(labels.dest, file));
  for (const file of result.removed) log(`  removed  ${at(file)}`);
  for (const file of result.written) log(`  wrote    ${at(file)}`);
  log(
    result.written.length + result.removed.length === 0
      ? `recipes:sync: the copy in ${labels.dest} already matches`
      : `recipes:sync: wrote ${result.written.length}, removed ${result.removed.length}`,
  );
  return 0;
}

const SCRIPT = /\.[cm]?[jt]sx?$/;

/** Every import in the recipe's script files that `isAllowedImport` refuses. */
export function findDisallowedImports(filesDir: string): ImportViolation[] {
  const files = listRecipeFiles(filesDir);
  const directories = ownedDirectories(files);
  const violations: ImportViolation[] = [];
  for (const file of files.filter((name) => SCRIPT.test(name))) {
    const source = readFileSync(join(filesDir, file), "utf8");
    for (const specifier of importSpecifiers(source)) {
      if (!isAllowedImport(specifier, file, directories)) {
        violations.push({ file, specifier });
      }
    }
  }
  return violations;
}
