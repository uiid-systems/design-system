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
    // getAbsolutePath("storybook-addon-test-codegen"),
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
    const sourcePackages = getUiidSourcePackages(packagesDir);

    if (!config.resolve) config.resolve = {};

    // Exact-match aliases so `@uiid/<pkg>` resolves to source while
    // subpath imports (e.g. `@uiid/<pkg>/globals.css`) keep using the
    // package's `exports` field. Array form lets us use regex anchors.
    const existingAliases = normalizeAliasArray(config.resolve.alias);
    config.resolve.alias = [
      ...sourcePackages.map(({ name, entry }) => ({
        find: new RegExp(`^${escapeRegex(name)}$`),
        replacement: entry,
      })),
      { find: "@tokens", replacement: resolve(packagesDir, "tokens/src") },
      ...existingAliases,
    ];

    // Workspace packages now point at source — don't let Vite pre-bundle them.
    if (!config.optimizeDeps) config.optimizeDeps = {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude ?? []),
      ...sourcePackages.map(({ name }) => name),
    ];

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
