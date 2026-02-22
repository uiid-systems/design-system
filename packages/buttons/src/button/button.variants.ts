import { cva } from "@uiid/utils";

import { BUTTON_DEFAULT_SIZE } from "./button.constants";
import styles from "./button.module.css";

export const buttonVariants = cva({
  variants: {
    shape: {
      pill: styles["shape-pill"],
      square: styles["shape-square"],
      circle: styles["shape-circle"],
    },
    fullwidth: { true: styles["fullwidth"] },
    variant: {
      subtle: styles["variant-subtle"],
      ghost: styles["variant-ghost"],
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
      critical: styles["tone-critical"],
      warning: styles["tone-warning"],
      info: styles["tone-info"],
    },
  },
  defaultVariants: {
    size: BUTTON_DEFAULT_SIZE,
  },
});
