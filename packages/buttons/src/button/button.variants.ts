import { cva } from "@uiid/utils";

import styles from "./button.module.css";

export const buttonVariants = cva({
  variants: {
    grows: { true: styles["toggle-grows"] },
    square: { true: styles["toggle-square"] },
    pill: { true: styles["toggle-pill"] },
    fullwidth: { true: styles["toggle-fullwidth"] },
    ghost: { true: styles["toggle-ghost"] },
    variant: {
      subtle: styles["variant-subtle"],
      inverted: styles["variant-inverted"],
    },
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
    tone: {
      positive: styles["tone-positive"],
      negative: styles["tone-negative"],
      warning: styles["tone-warning"],
      info: styles["tone-info"],
    },
  },
  defaultVariants: {
    size: "medium",
    grows: true,
  },
});
