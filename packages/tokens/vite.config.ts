import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { rewriteDeclarationsIn } from "@uiid/config/scripts/dts-relative-extensions.mjs";
import { defineConfig, type Plugin } from "vite";

const SRC_DIR = fileURLToPath(new URL("src/", import.meta.url));
const DIST_DIR = fileURLToPath(new URL("dist/", import.meta.url));

// `tsc -b` writes the palette's declarations but none for the token JSON they
// import, so `import colors from "./json/…/colors.tokens.json"` in
// dist/palette.d.ts would point at nothing. This writes a declaration beside
// it for each JSON file a declaration imports, typing the default export as the
// JSON itself, then runs the shared `.js`-extension rewrite over dist, which
// only rewrites a specifier once its declaration exists.
const JSON_IMPORT = /from\s+"(\.{1,2}\/[^"]+\.json)"/g;

const declareImportedJson = (): Plugin => ({
  name: "declare-imported-json",
  apply: "build",
  closeBundle() {
    const declarations = readdirSync(DIST_DIR, { recursive: true })
      .map(String)
      .filter((file) => file.endsWith(".d.ts"));
    for (const file of declarations) {
      const content = readFileSync(join(DIST_DIR, file), "utf8");
      for (const [, specifier] of content.matchAll(JSON_IMPORT)) {
        const json = join(dirname(file), specifier);
        const value = JSON.parse(readFileSync(join(SRC_DIR, json), "utf8"));
        const target = join(DIST_DIR, `${json}.d.ts`);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(
          target,
          `declare const _default: ${JSON.stringify(value, null, 2)}\n;\n\nexport default _default;\n`,
        );
      }
    }
    rewriteDeclarationsIn(DIST_DIR);
  },
});

/*
 * Tokens are mostly generated CSS, but the palette ships as a tiny ES module
 * alongside it so consumers can read the hue set at build time. It is compiled
 * rather than exported as source: @uiid/tokens is published, and a raw `.ts`
 * entry point (with a JSON import) is not something an installing consumer can
 * be expected to transpile.
 *
 * This does not use the shared `createViteConfig` factory — that one is for the
 * React component packages and pulls in the "use client" directive handling,
 * which does not apply here.
 */
export default defineConfig({
  plugins: [declareImportedJson()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      /* Without this, lib mode names the bundle after the package ("tokens.js")
         and the "." export would not resolve. */
      fileName: "index",
    },
    // dist already holds the declarations `tsc -b` wrote. The build script
    // empties it first (packages/config/scripts/clean-build-output.mjs).
    emptyOutDir: false,
  },
});
