import type { PaletteColor } from "@uiid/tokens";
import type { SpacingProps, RenderProp } from "@uiid/utils";

export type TextVariants = {
  /** Type scale step, from -1 to 6 */
  size?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Font weight */
  weight?: "thin" | "light" | "normal" | "medium" | "semibold" | "bold";
  /** Typeface family */
  family?: "sans" | "serif" | "mono";
  /**
   * Foreground color from the shade scale
   * @deprecated Use `emphasis`, with `color` for a hue.
   */
  shade?:
    | "background"
    | "surface"
    | "accent"
    | "halftone"
    | "muted"
    | "foreground";
  /** Palette color for the text */
  color?: PaletteColor;
  /** Emphasis within the palette color — `neutral` when no `color` is set */
  emphasis?: "default" | "muted" | "subtle";
  /** Underline the text — `false` forces no underline */
  underline?: boolean;
  /** Strike through the text */
  strikethrough?: boolean;
  /** Render the text in capitals */
  uppercase?: boolean;
  /** Balance line lengths across wrapped lines */
  balance?: boolean;
  /** Truncate overflowing text with an ellipsis */
  truncate?: boolean;
};

export type TextProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> &
  React.PropsWithChildren<{
    /** Ref to the underlying element */
    ref?: React.Ref<HTMLSpanElement>;
    /** Replace the rendered element, e.g. `render={<h2 />}` */
    render?: RenderProp;
    /** Inline styles merged onto the element */
    style?: React.CSSProperties;
    /** Class names merged onto the element */
    className?: string;
  }> &
  TextVariants &
  SpacingProps;
