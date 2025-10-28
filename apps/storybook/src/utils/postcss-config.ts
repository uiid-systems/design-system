import postcssLayerWrapper from "../../../../scripts/postcss-layer-wrapper.cjs";

/**
 * Component packages that should be wrapped in the uiid.components layer
 */
const COMPONENT_PACKAGES = [
  "buttons",
  "cards",
  "calendars",
  "forms",
  "indicators",
  "interactive",
  "layout",
  "overlays",
  "typography",
];

/**
 * Applies PostCSS layer wrapper to component packages in the Vite config.
 * This ensures component CSS is wrapped in @layer uiid.components,
 * while tokens and utilities remain in their own layers.
 */
export function applyPostCSSLayers(config: any): any {
  // Ensure css.postcss is an object, not a string
  if (!config.css) {
    config.css = {};
  }

  if (typeof config.css.postcss === "string" || !config.css.postcss) {
    config.css.postcss = { plugins: [] };
  }

  if (!Array.isArray(config.css.postcss.plugins)) {
    config.css.postcss.plugins = [];
  }

  // Add layer wrapper for component CSS only
  config.css.postcss.plugins.push(
    postcssLayerWrapper("uiid.components", {
      shouldWrap: (filePath) => {
        // Only wrap CSS from component packages, not tokens or utils
        return COMPONENT_PACKAGES.some((pkg) =>
          filePath.includes(`packages/${pkg}/`),
        );
      },
    }),
  );

  return config;
}
