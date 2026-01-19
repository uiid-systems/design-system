import { cva } from "@uiid/utils";

import styles from "./text.module.css";

export const textVariants = cva({
  variants: {
    strikethrough: { true: styles["toggle-strikethrough"] },
    balance: { true: styles["toggle-balance"] },
    mono: { true: styles["toggle-mono"] },
    underline: {
      true: styles["toggle-underline"],
      false: styles["toggle-no-underline"],
    },
    family: {
      mono: styles["family-mono"],
      serif: styles["family-serif"],
      sans: styles["family-sans"],
    },
    weight: {
      bold: styles["weight-bold"],
      normal: styles["weight-normal"],
      light: styles["weight-light"],
      thin: styles["weight-thin"],
    },
    shade: {
      background: styles["shade-background"],
      surface: styles["shade-surface"],
      accent: styles["shade-accent"],
      halftone: styles["shade-halftone"],
      muted: styles["shade-muted"],
      foreground: styles["shade-foreground"],
    },
    tone: {
      positive: styles["tone-positive"],
      negative: styles["tone-negative"],
      warning: styles["tone-warning"],
      info: styles["tone-info"],
    },
    size: {
      [-1]: styles["text-size--1"],
      0: styles["text-size-0"],
      1: styles["text-size-1"],
      2: styles["text-size-2"],
      3: styles["text-size-3"],
      4: styles["text-size-4"],
      5: styles["text-size-5"],
      6: styles["text-size-6"],
      7: styles["text-size-7"],
      8: styles["text-size-8"],
    },
  },
});
