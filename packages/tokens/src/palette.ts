import colors from "./json/primitives/colors.tokens.json";

type ColorEntries = typeof colors.color;

/**
 * Every hue in the palette, derived from the token JSON rather than restated,
 * so adding a ramp there widens the type everywhere it is consumed.
 *
 * A hue *is* a ramp — an entry carrying a `500` step. Testing for that step is
 * what keeps two other kinds of sibling key out: DTCG group metadata (`$type`,
 * `$description`) and the bare `white`/`black` values, which are not palette
 * hues and have no steps to tint a component with.
 */
export type PaletteColor = {
  [K in keyof ColorEntries]: ColorEntries[K] extends {
    "500": { $value: string };
  }
    ? K
    : never;
}[keyof ColorEntries];

/** The same set at runtime, in the order the tokens declare them. */
export const PALETTE_HUES = Object.entries(colors.color)
  .filter(
    ([, entry]) =>
      typeof entry === "object" && entry !== null && "500" in entry,
  )
  .map(([hue]) => hue) as PaletteColor[];

/** A hue's authored value — the 500 step every ramp is anchored on. */
export const paletteAnchor = (hue: PaletteColor): string =>
  colors.color[hue]["500"].$value;

/**
 * The class that carries a hue, publishing that hue's semantic `--palette-*`
 * names. A component applies one of these alongside its own treatment class, so
 * the hue rides on the class and the component's CSS never names a hue or step.
 *
 * These are global class names, not CSS-module ones, because a module's hashes
 * are per-build and so unreachable from `globals.css` — see `palette.css`. That
 * also means a hue added to the token JSON appears here automatically but needs
 * a matching block in `palette.css` to resolve to anything.
 */
export const paletteColorStyles = Object.fromEntries(
  PALETTE_HUES.map((hue) => [hue, `palette-${hue}`]),
) as Record<PaletteColor, string>;

/**
 * The pair of classes a hue rides on: the hue itself, and the component's own
 * treatment class that reads the `--palette-*` names it publishes. Neither half
 * does anything alone — the hue publishes names nothing consumes, and the
 * treatment consumes names nothing published — so they are only ever applied
 * together.
 *
 * Returns `undefined` rather than an empty string for an unset hue, so a
 * component drops straight through `cx` and lands on its shade defaults.
 * `treatment` is the caller's CSS-module class, which is why the pairing is a
 * function here instead of a second map: the module hash is per-component.
 */
export const paletteClassName = (
  color: PaletteColor | undefined,
  treatment: string,
): string | undefined =>
  color ? `${paletteColorStyles[color]} ${treatment}` : undefined;

/**
 * The same pairing for every hue at once, shaped as the map a `cva` `color`
 * variant takes. Use this where the hue is a variant rather than a prop the
 * component branches on — the treatment is identical across hues, so the map is
 * derived rather than listed and a new ramp in the token JSON appears here on
 * its own.
 */
export const paletteVariantStyles = (
  treatment: string,
): Record<PaletteColor, string> =>
  Object.fromEntries(
    PALETTE_HUES.map((hue) => [hue, `${paletteColorStyles[hue]} ${treatment}`]),
  ) as Record<PaletteColor, string>;
