import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Entry point for your library
      entry: "src/index.ts",
      // Name of the library (used for UMD builds)
      name: "UiidIcons",
      // Output file name pattern
      fileName: "uiid-icons",
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library (React and ReactDOM in this case)
      external: ["react", "react-dom", "lucide-react"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "lucide-react": "LucideReact",
        },
        // Preserve existing files in dist
        preserveModules: false,
      },
    },
    // Don't clean the dist directory to preserve TypeScript declaration files
    emptyOutDir: false,
  },
});
