import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Resolve @uiid/* packages to source files for testing without building
// Note: tokens is handled separately below — it serves a TS entry point and
// several CSS subpaths from different directories, so one prefix cannot cover it
const uiidPackages = [
  "blocks",
  "buttons",
  "calendars",
  "cards",
  "code",
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

const uiidAliases = uiidPackages.map((pkg) => ({
  find: `@uiid/${pkg}`,
  replacement: path.resolve(__dirname, `packages/${pkg}/src/index.ts`),
}));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Array form, because tokens needs exact-match rules that a prefix map
    // cannot express. First match wins, so these run most-specific first.
    alias: [
      ...uiidAliases,
      // Hand-written CSS at the package root (src/css/ is gitignored and holds
      // only generated token files).
      {
        find: /^@uiid\/tokens\/(compositions\.module|globals|palette)\.css$/,
        replacement: path.resolve(__dirname, "packages/tokens/src/$1.css"),
      },
      // The palette ships as TS from the package root, not as a token CSS file.
      {
        find: /^@uiid\/tokens$/,
        replacement: path.resolve(__dirname, "packages/tokens/src/index.ts"),
      },
      // Everything else under @uiid/tokens/ is a generated token stylesheet.
      // The separator is appended explicitly: path.resolve strips a trailing
      // slash, which would splice the subpath straight onto "css".
      {
        find: /^@uiid\/tokens\//,
        replacement: path.resolve(__dirname, "packages/tokens/src/css") + "/",
      },
    ],
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "packages/**/*.test.{ts,tsx}",
      "apps/**/__tests__/*.test.{ts,tsx}",
    ],
    css: true,
  },
});
