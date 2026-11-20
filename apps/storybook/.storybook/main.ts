import { readdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

import { applyPostCSSLayers } from "../src/utils/postcss-config.ts";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("storybook-addon-tag-badges"),
    "@github-ui/storybook-addon-performance-panel",
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  async viteFinal(config) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const packagesDir = resolve(__dirname, "../../../packages");
    const sourcePackages = getUiidSourcePackages(packagesDir).filter(
      ({ name }) => !SOURCE_CONDITION_PACKAGES.has(name),
    );

    if (!config.resolve) config.resolve = {};

    // Packages that export `src/index.ts` under the `@uiid/source` condition
    // resolve through it instead of an alias. Setting `conditions` replaces
    // Vite's defaults, so fall back to `defaultClientConditions`, copied by hand
    // from the installed Vite 7, when unset. The package's `exports` key order
    // picks the target, not this array, so `@uiid/source` must stay the first
    // key in each exports entry.
    config.resolve.conditions = [
      "@uiid/source",
      ...(config.resolve.conditions ?? [
        "module",
        "browser",
        "development|production",
      ]),
    ];

    // Exact-match aliases so `@uiid/<pkg>` resolves to source while
    // subpath imports (e.g. `@uiid/<pkg>/globals.css`) keep using the
    // package's `exports` field. Array form lets us use regex anchors.
    const existingAliases = normalizeAliasArray(config.resolve.alias);
    config.resolve.alias = [
      ...sourcePackages.map(({ name, entry }) => ({
        find: new RegExp(`^${escapeRegex(name)}$`),
        replacement: entry,
      })),
      // Vite's CSS `@import` resolver only matches `style` and
      // `development|production`, never a custom condition, so the barrel's
      // `@import "@uiid/layout/globals.css"` would still need a built dist.
      // Source CSS modules already reach the page in the same layer, so the
      // built sheet is a duplicate here; stub it as the Vitest config does.
      ...[...SOURCE_CONDITION_PACKAGES].map((name) => ({
        find: new RegExp(`^${escapeRegex(name)}/globals\\.css$`),
        replacement: resolve(__dirname, "../../../vitest.empty.css"),
      })),
      { find: "@tokens", replacement: resolve(packagesDir, "tokens/src") },
      ...existingAliases,
    ];

    // Do not add `@uiid/*` to `optimizeDeps.exclude`. They resolve to files outside
    // node_modules, so Vite never pre-bundles them anyway, and Vite's dep scanner
    // stops at any excluded id (and its subpaths). Excluding them hid every third-party
    // import behind them, such as the lucide modules behind `@uiid/icons/<icon>`, so
    // a cold cache discovered them mid-run and reloaded the browser tests (UI-403).

    // `@uiid/*` resolve to source above, so Rollup bundles the 185 files that
    // carry "use client" for downstream Next.js consumers — plus Base UI's own
    // "use client" modules. The directive is inert in a bundled static Storybook,
    // and Rollup warns once per file, then warns again when it cannot map that
    // warning back through the SWC sourcemap. 653 of the build's 710 warning
    // lines are these two, which is enough to bury a real failure in a CI log.
    config.build ??= {};
    config.build.rollupOptions ??= {};
    const inheritedOnWarn = config.build.rollupOptions.onwarn;
    config.build.rollupOptions.onwarn = (warning, defaultHandler) => {
      if (
        warning.code === "MODULE_LEVEL_DIRECTIVE" ||
        warning.code === "SOURCEMAP_ERROR"
      ) {
        return;
      }
      if (inheritedOnWarn) inheritedOnWarn(warning, defaultHandler);
      else defaultHandler(warning);
    };

    return applyPostCSSLayers(config);
  },
};

export default config;

// Returns `T` so literal addon/framework names survive, satisfying Storybook's
// narrowly-typed `framework.name` without widening to `string`.
function getAbsolutePath<T extends string>(value: T): T {
  return dirname(
    fileURLToPath(import.meta.resolve(`${value}/package.json`)),
  ) as T;
}

// Resolved by the `@uiid/source` export condition rather than an alias (UI-420).
// The remaining packages move over, and the alias goes, in a follow-up.
const SOURCE_CONDITION_PACKAGES = new Set(["@uiid/utils", "@uiid/layout"]);

type SourcePackage = { name: string; entry: string };

function getUiidSourcePackages(packagesDir: string): SourcePackage[] {
  const result: SourcePackage[] = [];
  for (const dir of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const pkgPath = resolve(packagesDir, dir.name, "package.json");
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { name?: string };
    if (!pkg.name?.startsWith("@uiid/")) continue;
    const srcTs = resolve(packagesDir, dir.name, "src/index.ts");
    const srcTsx = resolve(packagesDir, dir.name, "src/index.tsx");
    const entry = existsSync(srcTs)
      ? srcTs
      : existsSync(srcTsx)
        ? srcTsx
        : null;
    if (!entry) continue;
    result.push({ name: pkg.name, entry });
  }
  return result;
}

function normalizeAliasArray(
  alias: unknown,
): Array<{ find: string | RegExp; replacement: string }> {
  if (!alias) return [];
  if (Array.isArray(alias)) return alias;
  return Object.entries(alias as Record<string, string>).map(
    ([find, replacement]) => ({ find, replacement }),
  );
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
