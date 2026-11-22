/**
 * CSS build options shared by the library builds (`vite.config.ts`) and
 * Storybook (`.storybook/main.ts`), so Storybook previews the CSS the packages
 * publish. `scripts/check-dist.mjs` checks the published CSS these options
 * produce.
 */

/**
 * Browsers that support CSS `light-dark()`, the `build.cssTarget` floor.
 *
 * Vite 8 minifies CSS with Lightning CSS, which lowers `light-dark()` for older
 * targets into `--lightningcss-light`/`--lightningcss-dark` fallbacks. Those
 * only work under an ancestor that sets `color-scheme`, which only the tokens'
 * globals.css does, so a package stylesheet loaded on its own would lose its
 * theme colors.
 */
export const cssTarget = [
  "chrome123",
  "edge123",
  "firefox120",
  "safari17.5",
  "ios17.5",
];

/**
 * `Features.Nesting` from lightningcss, written as its value because
 * lightningcss is only a dependency of Vite here.
 */
const NESTING = 1;

/**
 * Every `cssTarget` browser supports native CSS nesting, so Lightning CSS
 * would ship nested rules as written. Lower them, as Vite 7's minifier did, so
 * stylesheets read flat in dev tools.
 */
export const lightningcss = { include: NESTING };
