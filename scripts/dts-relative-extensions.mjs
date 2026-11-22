import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { moduleSpecifiers } from "./module-specifiers.mjs";

// tsc copies relative specifiers into declarations as written, and our source
// writes them extensionless (`./button/button`), which `bundler` resolution
// accepts. Under `node16`/`nodenext` a relative import in an ES module must
// name its file, so a consumer on either gets TS2307 and loses the types behind
// it. This rewrites each relative specifier in the emitted declarations to the
// form both resolutions accept: `./button/button.js` for a file, and
// `./button/index.js` for a directory.
//
// A JSON import is the same case: the tokens build writes
// `colors.tokens.json.d.ts` but not the JSON, so `./colors.tokens.json` only
// resolves under `bundler` (which appends `.d.ts`). `./colors.tokens.json.js`
// reaches that declaration under both. A specifier that already names a file
// matches neither rule and is left alone.
//
// Fixing the declarations rather than the source keeps the ~1,400 source
// imports as they are; vite already writes `.js` specifiers into the JS it
// emits, so only the declarations ever carried the problem.

// `moduleSpecifiers` skips comments and strings, so text that only looks like
// an import, in a string or a JSDoc comment, is left alone. It covers static
// imports and re-exports, side-effect imports, `import("...")` types,
// `require` and `declare module`.
const resolvedSpecifier = (dir, specifier) => {
  if (!/^\.{1,2}\//.test(specifier)) return null;
  const base = join(dir, specifier);
  if (existsSync(`${base}.d.ts`)) return `${specifier}.js`;
  if (existsSync(join(base, "index.d.ts"))) {
    return `${specifier.replace(/\/$/, "")}/index.js`;
  }
  return null;
};

function addRelativeExtensions(content, file) {
  const dir = dirname(file);
  let next = content;
  // Back to front, so each edit leaves the earlier positions valid.
  for (const { specifier, start, end } of moduleSpecifiers(
    content,
  ).toReversed()) {
    const rewritten = resolvedSpecifier(dir, specifier);
    if (rewritten) next = next.slice(0, start) + rewritten + next.slice(end);
  }
  return next;
}

// tsc keeps a side-effect import in a declaration, so `import "./globals.css";`
// in a barrel reaches the .d.ts. It carries no types, and the stylesheet it
// names is not in dist under that name, so a consumer with
// `noUncheckedSideEffectImports` on and `skipLibCheck` off would get TS2882.
const CSS_SIDE_EFFECT_IMPORT =
  /^import\s+["']\.{1,2}\/[^"']+\.css["'];?\r?\n/gm;

const rewrite = (files) => {
  for (const file of files) {
    if (!file.endsWith(".d.ts")) continue;
    const content = readFileSync(file, "utf8");
    const next = addRelativeExtensions(
      content.replace(CSS_SIDE_EFFECT_IMPORT, ""),
      file,
    );
    if (next !== content) writeFileSync(file, next);
  }
};

/**
 * Rewrites every declaration under `dir`. Run once every declaration is on
 * disk: `rewriteDistDeclarations` in vite.config.ts and the tokens Vite config
 * call it after the bundle.
 */
export const rewriteDeclarationsIn = (dir) =>
  rewrite(readdirSync(dir, { recursive: true }).map((file) => join(dir, file)));
