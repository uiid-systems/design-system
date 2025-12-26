import { defineWorkspace } from "vitest/config";

/**
 * Vitest Workspace Configuration
 *
 * This workspace enables running tests across all packages with combined coverage.
 *
 * Usage:
 * - Individual package: `cd packages/buttons && pnpm test --coverage`
 * - All packages:       `pnpm vitest --coverage` (from root)
 * - Specific project:   `pnpm vitest --project buttons --coverage`
 *
 * Each package maintains its own vitest.config.ts for independent testing.
 */
export default defineWorkspace([
  // Component packages (unit tests with happy-dom)
  {
    extends: "packages/buttons/vitest.config.ts",
    test: {
      name: "buttons",
      root: "./packages/buttons",
    },
  },
  {
    extends: "packages/calendars/vitest.config.ts",
    test: {
      name: "calendars",
      root: "./packages/calendars",
    },
  },
  {
    extends: "packages/cards/vitest.config.ts",
    test: {
      name: "cards",
      root: "./packages/cards",
    },
  },
  {
    extends: "packages/forms/vitest.config.ts",
    test: {
      name: "forms",
      root: "./packages/forms",
    },
  },
  {
    extends: "packages/indicators/vitest.config.ts",
    test: {
      name: "indicators",
      root: "./packages/indicators",
    },
  },
  {
    extends: "packages/interactive/vitest.config.ts",
    test: {
      name: "interactive",
      root: "./packages/interactive",
    },
  },
  {
    extends: "packages/layout/vitest.config.ts",
    test: {
      name: "layout",
      root: "./packages/layout",
    },
  },
  {
    extends: "packages/navigation/vitest.config.ts",
    test: {
      name: "navigation",
      root: "./packages/navigation",
    },
  },
  {
    extends: "packages/overlays/vitest.config.ts",
    test: {
      name: "overlays",
      root: "./packages/overlays",
    },
  },
  {
    extends: "packages/tables/vitest.config.ts",
    test: {
      name: "tables",
      root: "./packages/tables",
    },
  },
  {
    extends: "packages/typography/vitest.config.ts",
    test: {
      name: "typography",
      root: "./packages/typography",
    },
  },
  {
    extends: "packages/utils/vitest.config.ts",
    test: {
      name: "utils",
      root: "./packages/utils",
    },
  },
  // Storybook integration tests (browser-based via playwright)
  // Note: Storybook tests use a different config structure with projects
  // Run separately: cd apps/storybook && pnpm vitest
]);
