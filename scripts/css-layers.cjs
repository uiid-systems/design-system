/**
 * The cascade layer each package's CSS is wrapped in. Package builds
 * (`createViteConfig`) and Storybook both read this one table, so a package
 * cascades the same in both. Layout and typography are primitives: component
 * CSS restyles them by layer order, not by specificity or source order.
 *
 * @type {Record<string, string>}
 */
module.exports = {
  layout: "uiid.primitives",
  typography: "uiid.primitives",
  buttons: "uiid.components",
  cards: "uiid.components",
  code: "uiid.components",
  forms: "uiid.components",
  indicators: "uiid.components",
  interactive: "uiid.components",
  lists: "uiid.components",
  navigation: "uiid.components",
  overlays: "uiid.components",
  tables: "uiid.components",
};
