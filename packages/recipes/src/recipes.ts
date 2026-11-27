/**
 * Keeps a project's copy of a recipe identical to the recipe's `files/`.
 *
 * Plain Node with no dependencies: Node runs this TypeScript directly by
 * stripping its types, so it uses erasable syntax only and imports with `.ts`.
 *
 * Ownership: a recipe owns the topmost directories under `files/` that
 * directly hold a file (today `components/shell`, `components/sidebar`,
 * `components/header`, `components/main`, `components/breadcrumbs` and `lib`).
 * The project's copy of an owned directory is the recipe's whole: every file in
 * it is compared, and a file the recipe does not have is extra. A directory the
 * recipe only passes through, such as `components/` or the root, is never
 * owned, so its other contents are never reported or touched. A file directly
 * under `files/` is compared on its own.
 */
import {
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, join, posix, relative, resolve, sep } from "node:path";

export type RecipeDiff = {
  /** In both, with different contents. */
  changed: string[];
  /** In the recipe, not in the destination. */
  missing: string[];
  /** In an owned directory of the destination, not in the recipe. */
  extra: string[];
};

export type SyncResult = {
  /** Files copied from the recipe, because they were changed or missing. */
  written: string[];
  /** Extra files deleted from owned directories. */
  removed: string[];
};

export type ImportViolation = { file: string; specifier: string };

/**
 * Resolves `path`, relative to `root`, and refuses anything that lands on or
 * outside the root: `..` segments that climb out, an absolute path, or the
 * root itself.
 */
export function resolveInside(root: string, path: string): string {
  const base = resolve(root);
  const target = resolve(base, path);
  const rel = relative(base, target);
  if (
    !rel ||
    rel === ".." ||
    rel.startsWith(`..${sep}`) ||
    isAbsolute(rel) ||
    isAbsolute(path)
  ) {
    throw new Error(
      `Refusing ${JSON.stringify(path)}: it resolves outside ${base}`,
    );
  }
  return target;
}

const NO_THROW = { throwIfNoEntry: false } as const;

/** Throws when `path` exists and is a symlink. */
function refuseSymlink(path: string) {
  if (lstatSync(path, NO_THROW)?.isSymbolicLink()) {
    throw new Error(`Refusing to follow the symlink at ${path}`);
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
 * Every file under `dir`, as sorted POSIX paths relative to it. A missing
 * directory has no files. A symlinked directory is refused; a symlinked file
 * is listed, so a caller can report it rather than follow it.
 */
function listFiles(dir: string): string[] {
  const found: string[] = [];
  const walk = (rel: string) => {
    for (const entry of readdirSync(join(dir, rel), { withFileTypes: true })) {
      const path = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path);
      else if (
        entry.isSymbolicLink() &&
        statSync(join(dir, path), NO_THROW)?.isDirectory()
      ) {
        throw new Error(`Refusing to follow the symlink at ${join(dir, path)}`);
      } else found.push(path);
    }
  };
  refuseSymlink(dir);
  if (lstatSync(dir, NO_THROW)) walk("");
  return found.sort();
}

/** The recipe's files, refusing any that is not a regular file. */
function listRecipeFiles(filesDir: string): string[] {
  const files = listFiles(filesDir);
  for (const file of files) {
    if (!lstatSync(join(filesDir, file)).isFile()) {
      throw new Error(
        `Recipe files must be regular files: ${join(filesDir, file)}`,
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

/**
 * Compares the recipe in `filesDir` with its copy under `destDir`. A
 * destination file that is a symlink, or not a file, counts as changed; a
 * symlinked directory on the way to one is refused.
 */
export function compareRecipe(filesDir: string, destDir: string): RecipeDiff {
  const recipe = listRecipeFiles(filesDir);
  const inRecipe = new Set(recipe);
  const diff: RecipeDiff = { changed: [], missing: [], extra: [] };

  for (const file of recipe) {
    const target = safeTarget(destDir, file, { leaf: false });
    const found = lstatSync(target, NO_THROW);
    if (!found) diff.missing.push(file);
    else if (
      !found.isFile() ||
      !readFileSync(join(filesDir, file)).equals(readFileSync(target))
    ) {
      diff.changed.push(file);
    }
  }
  for (const dir of ownedDirectories(recipe)) {
    for (const file of listFiles(safeTarget(destDir, dir))) {
      const path = `${dir}/${file}`;
      if (!inRecipe.has(path)) diff.extra.push(path);
    }
  }
  diff.extra.sort();
  return diff;
}

/**
 * Makes `destDir`'s copy of the recipe identical to `filesDir`: copies changed
 * and missing files and deletes extra ones, then removes directories inside an
 * owned directory that the deletions left empty. Every target is checked before
 * anything changes, and a symlink anywhere on a target's path stops the sync.
 */
export function syncRecipe(filesDir: string, destDir: string): SyncResult {
  const diff = compareRecipe(filesDir, destDir);
  const written = [...diff.changed, ...diff.missing].sort();
  const writes = written.map((file) => [
    join(filesDir, file),
    safeTarget(destDir, file),
  ]);
  const removals = diff.extra.map((file) => safeTarget(destDir, file));

  for (const [source, target] of writes) {
    mkdirSync(resolve(target, ".."), { recursive: true });
    writeFileSync(target, readFileSync(source));
  }
  for (const target of removals) unlinkSync(target);

  const owned = ownedDirectories(listRecipeFiles(filesDir)).map((dir) =>
    safeTarget(destDir, dir),
  );
  for (const file of diff.extra) {
    let dir = resolve(safeTarget(destDir, file), "..");
    while (
      !owned.includes(dir) &&
      owned.some((root) => dir.startsWith(`${root}${sep}`))
    ) {
      if (readdirSync(dir).length > 0) break;
      rmdirSync(dir);
      dir = resolve(dir, "..");
    }
  }

  return { written, removed: diff.extra };
}

/**
 * The module specifiers a source file names: static, type-only and
 * side-effect imports, re-exports, dynamic `import()` and `require()`. A
 * specifier inside a comment or a string is found too, which can only make
 * the check stricter.
 */
export function importSpecifiers(source: string): string[] {
  const pattern = /\b(?:from|import|require)\s*\(?\s*(["'`])([^"'`\n]+)\1/g;
  return [...source.matchAll(pattern)].map((match) => match[2]);
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
 * that stays inside the file's own recipe directory.
 */
export function isAllowedImport(
  specifier: string,
  file: string,
  recipeDirectories: string[],
): boolean {
  if (
    PACKAGES.some(
      (name) => specifier === name || specifier.startsWith(`${name}/`),
    )
  ) {
    return true;
  }
  if (SUBPATH_PACKAGES.some((name) => specifier.startsWith(`${name}/`)))
    return true;
  if (PROJECT_MODULES.includes(specifier)) return true;

  const inside = (path: string, dir: string) =>
    path === dir || path.startsWith(`${dir}/`);
  if (specifier.startsWith("@/components/")) {
    const path = specifier.slice(2);
    return recipeDirectories.some(
      (dir) => dir.startsWith("components/") && inside(path, dir),
    );
  }
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const own = recipeDirectories.find((dir) => inside(file, dir));
    const path = posix.normalize(posix.join(posix.dirname(file), specifier));
    return own !== undefined && inside(path, own);
  }
  return false;
}

/**
 * Everything `recipes:check` fails on, one line per problem: each changed,
 * missing and extra file in the destination, then each disallowed import in
 * the recipe. `labels` are the directory names to print in front of each path.
 * No lines means the check passes.
 */
export function checkRecipe(
  filesDir: string,
  destDir: string,
  labels = { files: filesDir, dest: destDir },
): string[] {
  const diff = compareRecipe(filesDir, destDir);
  const at = (file: string) => posix.join(labels.dest, file);
  return [
    ...diff.changed.map((file) => `changed  ${at(file)}`),
    ...diff.missing.map((file) => `missing  ${at(file)}`),
    ...diff.extra.map((file) => `extra    ${at(file)}`),
    ...findDisallowedImports(filesDir).map(
      ({ file, specifier }) =>
        `import   ${posix.join(labels.files, file)} imports ${JSON.stringify(specifier)}, which a recipe file may not import`,
    ),
  ];
}

const SCRIPT = /\.[cm]?[jt]sx?$/;

/** Every import in the recipe's script files that `isAllowedImport` refuses. */
export function findDisallowedImports(filesDir: string): ImportViolation[] {
  const files = listRecipeFiles(filesDir);
  const directories = ownedDirectories(files);
  const violations: ImportViolation[] = [];
  for (const file of files.filter((name) => SCRIPT.test(name))) {
    for (const specifier of importSpecifiers(
      readFileSync(join(filesDir, file), "utf8"),
    )) {
      if (!isAllowedImport(specifier, file, directories))
        violations.push({ file, specifier });
    }
  }
  return violations;
}
