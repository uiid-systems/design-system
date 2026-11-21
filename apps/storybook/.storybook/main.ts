import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import { defaultClientConditions } from "vite";

import { cssTarget, lightningcss } from "../../../scripts/css-target.ts";
import { emitGeneratedSources } from "../../../scripts/emit-generated-sources.ts";
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
    // Token CSS and per-icon modules are generated, not committed. This hook runs
    // for `dev`, `build-storybook` and the addon's Vitest project alike, so all
    // three work on a checkout that has never been built. The addon's project
    // calls this hook several times; the generators still run once per process.
    emitGeneratedSources();

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const packagesDir = resolve(__dirname, "../../../packages");

    if (!config.resolve) config.resolve = {};

    // Every @uiid/* package exports its source under the `@uiid/source`
    // condition, so stories resolve them to `src/`. Setting `conditions` replaces
    // Vite's defaults, so fall back to Vite's `defaultClientConditions` when
    // unset. The package's `exports` key order picks the target, not this
    // array, so `@uiid/source` must stay the first key in each exports entry.
    config.resolve.conditions = [
      "@uiid/source",
      ...(config.resolve.conditions ?? defaultClientConditions),
    ];

    // Array form lets the stub below use a regex.
    const existingAliases = normalizeAliasArray(config.resolve.alias);
    config.resolve.alias = [
      // Vite's CSS `@import` resolver only matches `style` and
      // `development|production`, never a custom condition, so the barrel's
      // `@import "@uiid/<pkg>/globals.css"` lines would pull each package's
      // built sheet. Source CSS modules already reach the page in the same
      // layer, so that sheet is a second copy of every rule; stub it as the
      // Vitest config does. Unlike Vitest, tokens are stubbed too: preview.ts
      // loads them through `@tokens/globals.css` on every page, MDX included,
      // so the barrel's copy would define every token a second time.
      {
        find: /^@uiid\/[\w-]+\/globals\.css$/,
        replacement: resolve(__dirname, "../../../vitest.empty.css"),
      },
      { find: "@tokens", replacement: resolve(packagesDir, "tokens/src") },
      ...existingAliases,
    ];

    // Do not add `@uiid/*` to `optimizeDeps.exclude`. They resolve to files outside
    // node_modules, so Vite never pre-bundles them anyway, and Vite's dep scanner
    // stops at any excluded id (and its subpaths). Excluding them hid every third-party
    // import behind them, such as the lucide modules behind `@uiid/icons/<icon>`, so
    // a cold cache discovered them mid-run and reloaded the browser tests (UI-403).

    // Minify CSS as the library builds do, so stories preview the published
    // stylesheets: `light-dark()` kept, nesting lowered.
    config.build ??= {};
    config.build.cssTarget = cssTarget;
    config.css ??= {};
    config.css.lightningcss = { ...config.css.lightningcss, ...lightningcss };

    // `@uiid/*` resolve to source through the condition, so Rolldown bundles
    // every module that carries "use client" for downstream Next.js consumers,
    // plus Base UI's own. The directive is inert in a bundled static Storybook,
    // and Rolldown warns once per module, hundreds of warnings that would bury a
    // real failure in a CI log.
    config.build.rolldownOptions ??= {};
    const inheritedOnWarn = config.build.rolldownOptions.onwarn;
    config.build.rolldownOptions.onwarn = (warning, defaultHandler) => {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
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

function normalizeAliasArray(
  alias: unknown,
): Array<{ find: string | RegExp; replacement: string }> {
  if (!alias) return [];
  if (Array.isArray(alias)) return alias;
  return Object.entries(alias as Record<string, string>).map(
    ([find, replacement]) => ({ find, replacement }),
  );
}
