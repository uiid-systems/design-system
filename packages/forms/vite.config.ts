import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import postcssLayerWrapper from "../../scripts/postcss-layer-wrapper.cjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [postcssLayerWrapper("uiid.components")],
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "TorettoForms",
      fileName: "forms",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "forms.css";
          return assetInfo.name || "";
        },
      },
    },
    cssCodeSplit: false,
  },
});
