import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// tsc copies relative specifiers into declarations as written, and our source
// writes them extensionless (`./button/button`), which `bundler` resolution
// accepts. Under `node16`/`nodenext` a relative import in an ES module must
// name its file, so a consumer on either gets TS2307 and loses the types behind
// it. This rewrites each relative specifier in the emitted declarations to the
// form both resolutions accept: `./button/button.js` for a file, and
// `./button/index.js` for a directory.
//
// A JSON import is the same case: the plugin emits `colors.tokens.json.d.ts`
// but not the JSON, so `./colors.tokens.json` only resolves under `bundler`
// (which appends `.d.ts`). `./colors.tokens.json.js` reaches that declaration
// under both. A specifier that already names a file matches neither rule and
// is left alone.
//
// Fixing the declarations rather than the source keeps the ~1,400 source
// imports as they are; vite already writes `.js` specifiers into the JS it
// emits, so only the declarations ever carried the problem.

// Static imports and re-exports, side-effect imports, and `import("...")` types.
const SPECIFIER_RE =
  /(\bfrom\s*|\bimport\s*\(?\s*)(["'])(\.{1,2}\/[^"'\n]*)\2/g;

function addRelativeExtensions(content, file) {
  const dir = dirname(file);
  return content.replace(SPECIFIER_RE, (match, lead, quote, specifier) => {
    const base = join(dir, specifier);
    const rewritten = existsSync(`${base}.d.ts`)
      ? `${specifier}.js`
      : existsSync(join(base, "index.d.ts"))
        ? `${specifier.replace(/\/$/, "")}/index.js`
        : null;
    return rewritten ? `${lead}${quote}${rewritten}${quote}` : match;
  });
}

const rewrite = (files) => {
  for (const file of files) {
    if (!file.endsWith(".d.ts")) continue;
    const content = readFileSync(file, "utf8");
    const next = addRelativeExtensions(content, file);
    if (next !== content) writeFileSync(file, next);
  }
};

/** vite-plugin-dts `afterBuild` hook: runs once every declaration is on disk. */
export const rewriteEmittedDeclarations = (emittedFiles) =>
  rewrite(emittedFiles.keys());

/** For declarations emitted outside vite-plugin-dts, as `@uiid/icons`'s are. */
export const rewriteDeclarationsIn = (dir) =>
  rewrite(readdirSync(dir, { recursive: true }).map((file) => join(dir, file)));
