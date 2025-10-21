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
      const toggleCssFiles = [
        path.resolve(__dirname, "src/props/toggles/bold.css"),
        path.resolve(__dirname, "src/props/toggles/evenly.css"),
        path.resolve(__dirname, "src/props/toggles/fullwidth.css"),
      ];

      for (const filePath of toggleCssFiles) {
        if (!fs.existsSync(filePath)) continue;
        const source = fs.readFileSync(filePath, "utf-8");

        this.emitFile({
          type: "asset",
          fileName: path.basename(filePath),
          source,
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
      name: "UiidUtils",
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
