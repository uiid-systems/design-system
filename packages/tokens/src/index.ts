/*
 * The palette is the one token export that is TypeScript rather than CSS. The
 * hue union and the `.palette-<hue>` class map are derived from the token JSON,
 * so components can take a `color` prop typed by the ramps that actually exist
 * instead of restating the hue list.
 */
export type { PaletteColor } from "./palette";
export { PALETTE_HUES, paletteAnchor, paletteColorStyles } from "./palette";
