// Lists every name a barrel exports, types included, by reading its source.
//
// A runtime `Object.keys` check sees values only, so a type-only export can be
// added or dropped without a barrel test noticing. This reads the barrel the
// way a reader does: `export { … }` lists (with `type` and `as`), declarations,
// `export * as ns`, and `export *` from a relative module, which it follows.
// It needs no build output and no compiler API.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// Strings are kept as they are, so a `//` inside a specifier is not a comment.
const COMMENT_OR_STRING =
  /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g;

const LIST = /export\s+(?:type\s+)?\{([^}]*)\}/g;
const STAR_AS = /export\s+\*\s+as\s+([\w$]+)\s+from\s+["'][^"']+["']/g;
const STAR = /export\s+\*\s+from\s+["']([^"']+)["']/g;
const DECLARATION =
  /export\s+(?:declare\s+)?(?:abstract\s+)?(?:async\s+)?(?:const|let|var|function\*?|class|type|interface|enum)\s+([\w$]+)/g;
const DEFAULT = /export\s+default\b/;

// A `.js` module with a `.d.ts` beside it is read through the declarations,
// which carry its types as well as its values.
const CANDIDATES = [".ts", ".tsx", ".d.ts", "/index.ts", "/index.tsx"];

function resolveModule(from, specifier) {
  const base = resolve(dirname(from), specifier.replace(/\.js$/, ""));
  for (const suffix of CANDIDATES) {
    if (existsSync(base + suffix)) return base + suffix;
  }
  throw new Error(`barrelExports: cannot resolve "${specifier}" from ${from}`);
}

function collect(file, names, seen) {
  if (seen.has(file)) return;
  seen.add(file);

  const source = readFileSync(file, "utf8").replace(
    COMMENT_OR_STRING,
    (match, string) => string ?? "",
  );

  for (const [, list] of source.matchAll(LIST)) {
    for (const item of list.split(",")) {
      const words = item
        .trim()
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/);
      const name = words.at(-1)?.trim();
      if (name) names.add(name);
    }
  }
  for (const [, name] of source.matchAll(STAR_AS)) names.add(name);
  for (const [, name] of source.matchAll(DECLARATION)) names.add(name);
  if (DEFAULT.test(source)) names.add("default");

  for (const [, specifier] of source.matchAll(STAR)) {
    if (!specifier.startsWith(".")) {
      throw new Error(
        `barrelExports: cannot follow "export * from \\"${specifier}\\"" in ${file}`,
      );
    }
    collect(resolveModule(file, specifier), names, seen);
  }
}

/** Every name the module at `file` exports, values and types, sorted. */
export function barrelExports(file) {
  const names = new Set();
  collect(resolve(file), names, new Set());
  return [...names].sort();
}
