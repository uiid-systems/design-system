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
      entry: "src/index.ts",
      name: "UiidLayout",
      fileName: "layout",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom", /^@uiid\//],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@uiid/icons": "UIIDIcons",
          "@uiid/tokens": "UIIDTokens",
          "@uiid/typography": "UIIDTypography",
          "@uiid/utils": "UIIDUtils",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "layout.css";
          return assetInfo.name || "";
        },
      },
    },
    cssCodeSplit: false,
  },
});
