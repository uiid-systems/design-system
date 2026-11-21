import { resolve } from "node:path";

import { defineConfig, type Plugin, type UserConfig } from "vite";

import { cssTarget, lightningcss } from "./scripts/css-target.ts";
import { rewriteDeclarationsIn } from "./scripts/dts-relative-extensions.mjs";
import postcssLayerWrapper from "./scripts/postcss-layer-wrapper.cjs";
import { sanitizeFileName } from "./scripts/rollup-sanitize-file-name.mjs";
import {
  preserveDirectives,
  restoresDirectivesOf,
} from "./scripts/vite-plugin-preserve-directives.mjs";

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
 * `tsc -b` writes the declarations into dist before Vite runs (see
 * tsconfig.package.json). Once the bundle is on disk too, give every relative
 * specifier in them a `.js` extension, so they resolve under `nodenext` as well
 * as `bundler`.
 */
export const rewriteDistDeclarations = (): Plugin => {
  let outDir = "";
  return {
    name: "rewrite-dist-declarations",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      rewriteDeclarationsIn(outDir);
    },
  };
};

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

  const plugins = [rewriteDistDeclarations()];

  if (usePreserveDirectives) {
    plugins.push(preserveDirectives());
  }

  return defineConfig({
    plugins,
    css: {
      lightningcss,
      ...(cssLayer && {
        postcss: {
          plugins: [postcssLayerWrapper(cssLayer)],
        },
      }),
    },
    build: {
      lib: {
        entry,
        formats: ["es"],
      },
      rolldownOptions: {
        external: [...baseExternal, ...external],
        // Rolldown warns once per module that starts with "use client". Silence
        // it only for modules `preserveDirectives` writes the directive back to.
        ...(usePreserveDirectives && {
          onwarn(warning, defaultHandler) {
            if (
              warning.code === "MODULE_LEVEL_DIRECTIVE" &&
              restoresDirectivesOf(warning.id)
            ) {
              return;
            }
            defaultHandler(warning);
          },
        }),
        output: {
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
          sanitizeFileName,
        },
      },
      cssTarget,
      cssCodeSplit: false,
      // dist already holds the declarations `tsc -b` wrote. The build script
      // empties it first (scripts/clean-build-output.mjs).
      emptyOutDir: false,
    },
  });
}
