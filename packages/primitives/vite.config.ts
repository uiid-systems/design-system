import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      // Entry point for your library
      entry: "src/index.ts",
      // Name of the library (used for UMD builds)
      name: "UiidPrimitives",
      // Output file name pattern
      fileName: "primitives",
      // Generate both ESM and UMD formats
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library (React and ReactDOM in this case)
      external: ["react", "react-dom"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        // Ensure CSS is inlined into JS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "primitives.css";
          return assetInfo.name;
        },
      },
    },
    // Inline all CSS into the JS bundle - no separate CSS file needed
    cssCodeSplit: false,
  },
});
