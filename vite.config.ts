import react from "@vitejs/plugin-react-swc";
import { defineConfig, type UserConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import postcssLayerWrapper from "./scripts/postcss-layer-wrapper.cjs";
import { preserveDirectives } from "./scripts/vite-plugin-preserve-directives.mjs";

type ViteConfigOptions = {
  /**
   * Library entry point(s). Defaults to a single `src/index.ts`. Pass an array to
   * emit additional entries alongside the barrel — `@uiid/design-system` uses
   * this for its `./icons` subpath, which must stay out of the root barrel so
   * importing a component never pulls the icon set in.
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

const baseExternal = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  /^@uiid\//,
];

export function createViteConfig(options: ViteConfigOptions = {}): UserConfig {
  const {
    entry = "src/index.ts",
    external = [],
    cssLayer,
    preserveDirectives: usePreserveDirectives = true,
  } = options;

  const plugins = [react(), tsconfigPaths(), dts({ insertTypesEntry: true })];

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
        },
      },
      cssCodeSplit: false,
    },
  });
}
