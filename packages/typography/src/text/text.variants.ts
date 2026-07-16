import { cva } from "@uiid/utils";

import styles from "./text.module.css";

/** Palette color styles — portable hue/chroma class definitions for use across components */
export const paletteColorStyles = {
  red: styles["color-red"],
  orange: styles["color-orange"],
  yellow: styles["color-yellow"],
  green: styles["color-green"],
  blue: styles["color-blue"],
  indigo: styles["color-indigo"],
  purple: styles["color-purple"],
  neutral: styles["color-neutral"],
};

const coloredClass = styles["colored"];

/** Text color styles — palette classes combined with text-specific color rendering */
const textColorStyles = Object.fromEntries(
  Object.entries(paletteColorStyles).map(([key, value]) => [
    key,
    `${value} ${coloredClass}`,
  ]),
) as Record<keyof typeof paletteColorStyles, string>;

export const textVariants = cva({
  variants: {
    /** Strike through the text */
    strikethrough: { true: styles["toggle-strikethrough"] },
    /** Balance line lengths across wrapped lines */
    balance: { true: styles["toggle-balance"] },
    /** Truncate overflowing text with an ellipsis */
    truncate: { true: styles["toggle-truncate"] },
    /** Underline the text — `false` forces no underline */
    underline: {
      true: styles["toggle-underline"],
      false: styles["toggle-no-underline"],
    },
    /** Typeface family */
    family: {
      mono: styles["family-mono"],
      serif: styles["family-serif"],
      sans: styles["family-sans"],
    },
    /** Font weight */
    weight: {
      thin: styles["weight-thin"],
      light: styles["weight-light"],
      normal: styles["weight-normal"],
      medium: styles["weight-medium"],
      semibold: styles["weight-semibold"],
      bold: styles["weight-bold"],
    },
    /** Foreground color from the shade scale */
    shade: {
      background: styles["shade-background"],
      surface: styles["shade-surface"],
      accent: styles["shade-accent"],
      halftone: styles["shade-halftone"],
      muted: styles["shade-muted"],
      foreground: styles["shade-foreground"],
    },
    /** Palette color for the text */
    color: textColorStyles,
    /** Type scale step, from -1 to 6 */
    size: {
      [-1]: styles["text-size--1"],
      0: styles["text-size-0"],
      1: styles["text-size-1"],
      2: styles["text-size-2"],
      3: styles["text-size-3"],
      4: styles["text-size-4"],
      5: styles["text-size-5"],
      6: styles["text-size-6"],
    },
  },
});
