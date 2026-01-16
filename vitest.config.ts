import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Resolve @uiid/* packages to source files for testing without building
// Note: tokens is excluded because it exports from src/ directly in package.json
const uiidPackages = [
  "backgrounds",
  "blocks",
  "buttons",
  "calendars",
  "cards",
  "forms",
  "icons",
  "indicators",
  "interactive",
  "layout",
  "lists",
  "navigation",
  "overlays",
  "tables",
  "typography",
  "utils",
];

const uiidAliases = Object.fromEntries(
  uiidPackages.map((pkg) => [
    `@uiid/${pkg}`,
    path.resolve(__dirname, `packages/${pkg}/src/index.ts`),
  ])
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ...uiidAliases,
      // Resolve @uiid/tokens/* CSS imports to source files
      // This uses a regex to match any .css file under @uiid/tokens/
      "@uiid/tokens": path.resolve(__dirname, "packages/tokens/src/css"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/**/*.test.{ts,tsx}"],
    css: true,
  },
});
