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
      name: "TorettoDropdowns",
      fileName: "dropdowns",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        /^@uiid\//,
        "date-fns",
        "react-day-picker",
        "lucide-react",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@uiid/buttons": "UIIDButtons",
          "@uiid/calendars": "UIIDCalendars",
          "@uiid/icons": "UIIDIcons",
          "@uiid/overlays": "UIIDOverlays",
          "date-fns": "dateFns",
          "react-day-picker": "ReactDayPicker",
          "lucide-react": "LucideReact",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "dropdowns.css";
          return assetInfo.name || "";
        },
      },
    },
    cssCodeSplit: false,
  },
});
