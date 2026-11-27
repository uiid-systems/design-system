import path from "path";

import { configDefaults, defineConfig } from "vitest/config";

// This file lives in packages/config, but tests run from the repo root, so
// globs and the paths Vitest prints are relative to the root.
const root = path.resolve(import.meta.dirname, "../..");

export default defineConfig({
  root,
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
        replacement: path.resolve(import.meta.dirname, "vitest.empty.css"),
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
    setupFiles: [path.resolve(import.meta.dirname, "vitest.setup.ts")],
    // Generates the token CSS and @uiid/icons' per-icon modules, which source
    // files import directly and which are generated rather than committed.
    globalSetup: [path.resolve(import.meta.dirname, "vitest.globalSetup.ts")],
    include: [
      "packages/**/*.test.{ts,tsx}",
      "packages/config/scripts/*.test.mjs",
      // The docs app's pure helpers and its nav config. The rest of the app
      // has no unit tests.
      "apps/docs/lib/**/*.test.ts",
      "apps/docs/*.test.ts",
    ],
    // Real-browser tests run from vitest.browser.config.ts instead.
    exclude: [...configDefaults.exclude, "**/*.browser.test.tsx"],
    css: true,
  },
});
