import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { defineConfig, type Plugin } from "vite";

import { sanitizeFileName } from "../../scripts/rollup-sanitize-file-name.mjs";
import { rewriteDistDeclarations } from "../../vite.config.ts";

// Declarations for the src/*.js modules that re-export lucide's deep paths.
// tsc emits no .d.ts for a .js module and does not copy a .d.ts input, and
// the bundle emits those .js modules into dist without one. So every
// src/*.d.ts ships into dist here, beside dist/index.d.ts, which re-exports
// them. Without them dist/index.d.ts re-exports modules with no types.
const SRC_DIR = fileURLToPath(new URL("src/", import.meta.url));
const srcDeclarations = () =>
  readdirSync(SRC_DIR).filter((file) => file.endsWith(".d.ts"));

const shipJsModuleDeclarations = (): Plugin => ({
  name: "ship-js-module-declarations",
  buildStart() {
    // Nothing imports a .d.ts, so watch mode would not re-emit an edited one.
    for (const fileName of srcDeclarations()) {
      this.addWatchFile(`${SRC_DIR}${fileName}`);
    }
  },
  generateBundle() {
    for (const fileName of srcDeclarations()) {
      this.emitFile({
        type: "asset",
        fileName,
        source: readFileSync(`${SRC_DIR}${fileName}`),
      });
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  // `tsc -b` writes the rest of dist's declarations. The shared rewrite runs
  // after this plugin has written the shipped ones, so it covers both.
  plugins: [shipJsModuleDeclarations(), rewriteDistDeclarations()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        /^@uiid\//,
        // Regex, not the bare string: the generated barrel imports lucide's
        // per-icon modules (`lucide-react/dist/esm/icons/globe.mjs`), and an
        // exact-string external does not match those deep specifiers — they
        // would be bundled in, inlining the entire icon set.
        /^lucide-react(\/|$)/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        sanitizeFileName,
      },
    },
    // dist already holds the declarations `tsc -b` wrote. The build script
    // empties it first (scripts/clean-build-output.mjs).
    emptyOutDir: false,
  },
});
