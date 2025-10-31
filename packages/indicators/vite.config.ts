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
      name: "UiidIndicators",
      fileName: "indicators",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom", /^@uiid\//, "@base-ui-components/react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@uiid/cards": "UIIDCards",
          "@uiid/tokens": "UIIDTokens",
          "@uiid/typography": "UIIDTypography",
          "@uiid/utils": "UIIDUtils",
          "@base-ui-components/react": "BaseUI",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "indicators.css";
          return assetInfo.name || "";
        },
      },
    },
    cssCodeSplit: false,
  },
});
