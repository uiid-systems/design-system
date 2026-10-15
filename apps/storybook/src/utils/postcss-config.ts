// @ts-expect-error - CJS module without type declarations
import cssLayers from "../../../../scripts/css-layers.cjs";
// @ts-expect-error - CJS module without type declarations
import postcssLayerWrapper from "../../../../scripts/postcss-layer-wrapper.cjs";

/**
 * The subset of Vite's config this helper reads and mutates. Declared
 * structurally so the storybook app doesn't need a direct `vite` dependency.
 */
type ConfigWithCss = {
  css?: {
    postcss?: string | { plugins?: unknown[] };
  };
};

/**
 * Applies the PostCSS layer wrapper to package CSS in the Vite config, each
 * package in the layer its build uses (`scripts/css-layers.cjs`), while tokens and
 * utilities remain in their own layers.
 */
export function applyPostCSSLayers<T extends ConfigWithCss>(config: T): T {
  const css = (config.css ??= {});

  // Ensure css.postcss is an object, not a string
  const postcss =
    typeof css.postcss === "object" && css.postcss
      ? css.postcss
      : (css.postcss = {});

  const plugins = Array.isArray(postcss.plugins)
    ? postcss.plugins
    : (postcss.plugins = []);

  // Wrap package CSS only; tokens and utilities keep their own layers
  for (const [pkg, layer] of Object.entries<string>(cssLayers)) {
    plugins.push(
      postcssLayerWrapper(layer, {
        shouldWrap: (filePath: string) => filePath.includes(`packages/${pkg}/`),
      }),
    );
  }

  return config;
}
