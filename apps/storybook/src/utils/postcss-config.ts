// @ts-expect-error - CJS module without type declarations
import postcssLayerWrapper from "../../../../scripts/postcss-layer-wrapper.cjs";

/**
 * Component packages that should be wrapped in the uiid.components layer
 */
const COMPONENT_PACKAGES = [
  "buttons",
  "calendars",
  "cards",
  "code",
  "forms",
  "indicators",
  "interactive",
  "layout",
  "lists",
  "navigation",
  "overlays",
  "tables",
  "typography",
];

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
 * Applies PostCSS layer wrapper to component packages in the Vite config.
 * This ensures component CSS is wrapped in @layer uiid.components,
 * while tokens and utilities remain in their own layers.
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

  // Add layer wrapper for component CSS only
  plugins.push(
    postcssLayerWrapper("uiid.components", {
      shouldWrap: (filePath: string) => {
        // Only wrap CSS from component packages, not tokens or utils
        return COMPONENT_PACKAGES.some((pkg) =>
          filePath.includes(`packages/${pkg}/`),
        );
      },
    }),
  );

  return config;
}
