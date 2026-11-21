import { resolve } from "node:path";

import { defineConfig, type Plugin, type UserConfig } from "vite";

import { cssTarget } from "./scripts/css-target.ts";
import { rewriteDeclarationsIn } from "./scripts/dts-relative-extensions.mjs";
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

/**
 * Every `cssTarget` browser supports native CSS nesting, so Lightning CSS would
 * ship the source's nested rules as they are. Vite 7's esbuild minifier
 * flattened them, and published stylesheets stay flat: `Features.Nesting` from
 * lightningcss, written as its value because lightningcss is only a dependency
 * of Vite here.
 */
const LIGHTNINGCSS_NESTING = 1;

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
      lightningcss: { include: LIGHTNINGCSS_NESTING },
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
        // Rolldown warns once per module that starts with "use client", which
        // `preserveDirectives` writes back onto the module's first line.
        ...(usePreserveDirectives && {
          onwarn(warning, defaultHandler) {
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
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
