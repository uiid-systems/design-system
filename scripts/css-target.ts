/**
 * Browsers that support CSS `light-dark()`, the `build.cssTarget` for the
 * library builds (`vite.config.ts`) and Storybook (`.storybook/main.ts`).
 *
 * Vite 8 minifies CSS with Lightning CSS, which lowers `light-dark()` for older
 * targets into `--lightningcss-light`/`--lightningcss-dark` fallbacks. Those
 * only work under an ancestor that sets `color-scheme`, which only the tokens'
 * globals.css does, so a package stylesheet loaded on its own would lose its
 * theme colors.
 */
export const cssTarget = ["chrome123", "firefox120", "safari17.5", "edge123"];
