import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import fs from "node:fs";
import path from "node:path";

const copyToggleCss = () => {
  return {
    name: "copy-toggle-css",
    generateBundle() {
      const togglesDir = path.resolve(__dirname, "src/props/toggles");

      // Auto-discover all .css files in the toggles directory
      const cssFiles = fs
        .readdirSync(togglesDir)
        .filter((file) => file.endsWith(".css"))
        .map((file) => path.join(togglesDir, file));

      for (const filePath of cssFiles) {
        const source = fs.readFileSync(filePath, "utf-8");

        // Wrap in @layer utilities for proper cascade ordering
        const layeredSource = `@layer uiid.utilities {\n${source}}\n`;

        // Emit at the dist root so consumers can import `@uiid/utils/evenly.css`.
        this.emitFile({
          type: "asset",
          fileName: path.basename(filePath),
          source: layeredSource,
        });
      }
    },
  } as const;
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
    }),
    copyToggleCss(),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "TorettoUtils",
      fileName: "utils",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    cssCodeSplit: false,
  },
});
