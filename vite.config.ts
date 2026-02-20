import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

import { preserveDirectives } from "./scripts/vite-plugin-preserve-directives.mjs";
import postcssLayerWrapper from "./scripts/postcss-layer-wrapper.cjs";

type ViteConfigOptions = {
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
        entry: "src/index.ts",
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
