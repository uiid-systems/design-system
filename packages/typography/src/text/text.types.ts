import type { PaletteColor } from "@uiid/tokens";
import type { SpacingProps, RenderProp } from "@uiid/utils";

export type TextVariants = {
  /** Type scale step, from -1 to 6 */
  size?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Font weight */
  weight?: "thin" | "light" | "normal" | "medium" | "semibold" | "bold";
  /** Typeface family */
  family?: "sans" | "serif" | "mono";
  /** Foreground color from the shade scale */
  shade?:
    | "background"
    | "surface"
    | "accent"
    | "halftone"
    | "muted"
    | "foreground";
  /** Palette color for the text */
  color?: PaletteColor;
  /** Underline the text — `false` forces no underline */
  underline?: boolean;
  /** Strike through the text */
  strikethrough?: boolean;
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
