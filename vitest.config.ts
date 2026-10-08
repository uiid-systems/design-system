import path from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// Resolve @uiid/* packages to source files for testing without building
// Note: tokens is handled separately below — it serves a TS entry point and
// several CSS subpaths from different directories, so one prefix cannot cover it
const uiidPackages = [
  "buttons",
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
      // @uiid/icons serves one module per icon from a generated directory at the
      // package root. These must precede the generic rules below: a string alias
      // for "@uiid/icons" also matches "@uiid/icons/globe", which would splice
      // the subpath onto src/index.ts.
      //
      // Our own icons resolve to source, like every other package here, so tests
      // do not depend on the package having been built.
      {
        find: /^@uiid\/icons\/loading-spinner$/,
        replacement: path.resolve(
          __dirname,
          "packages/icons/src/components/loading-spinner.tsx",
        ),
      },
      // lucide's icons resolve to the generated re-export modules, which the repo
      // postinstall emits (as do `build` and `dev`).
      {
        find: /^@uiid\/icons\/(.+)$/,
        replacement: path.resolve(__dirname, "packages/icons/icons") + "/$1.js",
      },
      // The design-system barrel re-exports every package above, so it resolves
      // to source the same way. Its `exports` map points at dist, which CI never
      // builds, so without this rule a consumer-side test only passes against a
      // stale local build.
      {
        find: /^@uiid\/design-system$/,
        replacement: path.resolve(
          __dirname,
          "packages/design-system/src/index.ts",
        ),
      },
      // That barrel's stylesheet imports every package's built `globals.css`.
      // Components already load their CSS modules from source, so under test
      // each built sheet stands in as an empty file. Tokens are excluded: they
      // have hand-written source CSS, matched by the rule further down. This
      // must precede the string aliases, which would otherwise prefix-match
      // `@uiid/buttons/globals.css` onto `src/index.ts/globals.css`.
      {
        find: /^@uiid\/(?!tokens\/)[\w-]+\/globals\.css$/,
        replacement: path.resolve(__dirname, "vitest.empty.css"),
      },
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
    // Emits @uiid/icons' per-icon modules, which source files import directly and
    // which are generated rather than committed.
    globalSetup: ["./vitest.globalSetup.ts"],
    include: [
      "packages/**/*.test.{ts,tsx}",
      "apps/**/__tests__/*.test.{ts,tsx}",
    ],
    css: true,
  },
});
