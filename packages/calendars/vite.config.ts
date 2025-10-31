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
      name: "UiidCalendars",
      fileName: "calendars",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        /^@uiid\//,
        "date-fns",
        "react-day-picker",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@uiid/buttons": "UIIDButtons",
          "@uiid/cards": "UIIDCards",
          "@uiid/icons": "UIIDIcons",
          "@uiid/layout": "UIIDLayout",
          "@uiid/tokens": "UIIDTokens",
          "@uiid/typography": "UIIDTypography",
          "@uiid/utils": "UIIDUtils",
          "date-fns": "dateFns",
          "react-day-picker": "ReactDayPicker",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "calendars.css";
          return assetInfo.name || "";
        },
      },
    },
    cssCodeSplit: false,
  },
});
