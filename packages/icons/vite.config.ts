import { readFileSync } from "node:fs";

import react from "@vitejs/plugin-react-swc";
import { defineConfig, type Plugin } from "vite";

import { sanitizeFileName } from "../../scripts/rollup-sanitize-file-name.mjs";

// Hand-written (or generated) declarations for the src/*.js modules that
// re-export lucide's deep paths. tsc emits no .d.ts for a .js module and does
// not copy a .d.ts input, so they are shipped into dist here, beside the .js
// vite emits for them. Without them dist/index.d.ts re-exports a module with
// no types.
const JS_MODULE_DECLARATIONS = [
  "lucide-icons.generated.d.ts",
  "create-lucide-icon.d.ts",
];

const shipJsModuleDeclarations = (): Plugin => ({
  name: "ship-js-module-declarations",
  generateBundle() {
    for (const fileName of JS_MODULE_DECLARATIONS) {
      this.emitFile({
        type: "asset",
        fileName,
        source: readFileSync(new URL(`src/${fileName}`, import.meta.url)),
      });
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), shipJsModuleDeclarations()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
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
    emptyOutDir: false,
  },
});
