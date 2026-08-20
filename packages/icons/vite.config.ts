import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

import { sanitizeFileName } from "../../scripts/rollup-sanitize-file-name.mjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
