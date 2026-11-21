import path from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Every @uiid/* package exports its source under the `@uiid/source`
    // condition, so tests resolve sibling packages to `src/` without a build.
    // happy-dom tests run in Vite's client environment and read these; tests
    // marked `@vitest-environment node` run in `ssr` and read
    // `ssr.resolve.conditions` below. Setting either list replaces Vite's
    // defaults, so each repeats them, copied by hand from the installed Vite 7
    // (`defaultClientConditions` here, `defaultServerConditions` below).
    // The package's `exports` key order decides which target wins, not the
    // order here, so `@uiid/source` must stay the first key in each entry.
    conditions: ["@uiid/source", "module", "browser", "development|production"],
    alias: [
      // The design-system barrel's stylesheet imports every package's built
      // `globals.css`, and Vite's CSS `@import` resolver ignores custom
      // conditions. Components already load their CSS modules from source, so
      // under test each built sheet stands in as an empty file. Tokens are
      // excluded: their CSS exports already point at source and generated files.
      {
        find: /^@uiid\/(?!tokens\/)[\w-]+\/globals\.css$/,
        replacement: path.resolve(__dirname, "vitest.empty.css"),
      },
    ],
  },
  ssr: {
    resolve: {
      conditions: ["@uiid/source", "module", "node", "development|production"],
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Generates the token CSS and @uiid/icons' per-icon modules, which source
    // files import directly and which are generated rather than committed.
    globalSetup: ["./vitest.globalSetup.ts"],
    include: ["packages/**/*.test.{ts,tsx}"],
    css: true,
  },
});
