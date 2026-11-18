import react from "@vitejs/plugin-react-swc";
import { defineConfig, type UserConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import postcssLayerWrapper from "./scripts/postcss-layer-wrapper.cjs";
import { sanitizeFileName } from "./scripts/rollup-sanitize-file-name.mjs";
import { preserveDirectives } from "./scripts/vite-plugin-preserve-directives.mjs";

type ViteConfigOptions = {
  /**
   * Library entry point(s). Defaults to a single `src/index.ts`. Pass an array to
   * emit additional entries alongside the barrel — `@uiid/design-system` uses
   * this for its `./icons` and `./utils` subpaths. Icons must stay out of the
   * root barrel so importing a component never pulls the icon set in, and the
   * helpers must be reachable without loading every component.
   */
  entry?: string | string[];
  /**
   * Additional external dependencies to exclude from bundle.
   * React, react-dom, and @uiid/* are always external.
   */
  external?: (string | RegExp)[];
  /**
   * CSS layer name for postcss wrapper (e.g., "uiid.components").
   * If not provided, no CSS layer wrapping is applied.
   */
  cssLayer?: string;
  /**
   * Whether to preserve "use client" directives. Defaults to true.
   */
  preserveDirectives?: boolean;
};

/**
 * Files the published declarations leave out. Tests and examples are compiled by
 * `tsc -b` (that build is the typecheck), but their `.d.ts` are noise in a
 * tarball. Setting `exclude` replaces the tsconfig's, so its entries are repeated.
 */
const dtsExclude = [
  "node_modules/**",
  "dist/**",
  "**/*.test.*",
  "**/*.examples.*",
  "**/*.stories.*",
];

const baseExternal = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  /^@uiid\//,
  /^@base-ui\/react(\/|$)/,
];

export function createViteConfig(options: ViteConfigOptions = {}): UserConfig {
  const {
    entry = "src/index.ts",
    external = [],
    cssLayer,
    preserveDirectives: usePreserveDirectives = true,
  } = options;

  const plugins = [
    react(),
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
      exclude: dtsExclude,
      // `files` ships dist only, so a map would point at source that is not in
      // the tarball. Vite empties dist before writing, so `tsc -b`'s own maps do
      // not survive either. The cost is that go-to-definition into a built
      // sibling package lands in its .d.ts rather than its source.
      compilerOptions: { declarationMap: false },
    }),
  ];

  if (usePreserveDirectives) {
    plugins.push(preserveDirectives());
  }

  return defineConfig({
    plugins,
    ...(cssLayer && {
      css: {
        postcss: {
          plugins: [postcssLayerWrapper(cssLayer)],
        },
      },
    }),
    build: {
      lib: {
        entry,
        formats: ["es"],
      },
      rollupOptions: {
        external: [...baseExternal, ...external],
        output: {
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
          sanitizeFileName,
        },
      },
      cssCodeSplit: false,
    },
  });
}
