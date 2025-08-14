import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    lib: {
      // Entry point for your library
      entry: "src/index.ts",
      // Name of the library (used for UMD builds)
      name: "UIID",
      // Output file name pattern
      fileName: "uiid",
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
      },
    },
    // Inline all CSS into the JS bundle - no separate CSS file needed
    cssCodeSplit: false,
  },
});
