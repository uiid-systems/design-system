import { cva } from "@uiid/utils";

import styles from "./text.module.css";

export const textVariants = cva({
  variants: {
    strikethrough: { true: styles["toggle-strikethrough"] },
    align: {
      center: styles["toggle-center"],
      left: styles["toggle-left"],
      right: styles["toggle-right"],
      justify: styles["toggle-justify"],
    },
    underline: {
      true: styles["toggle-underline"],
      false: styles["toggle-no-underline"],
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
      muted: styles["shade-muted"],
      halftone: styles["shade-halftone"],
      accent: styles["shade-accent"],
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
