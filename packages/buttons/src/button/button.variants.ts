import { cva } from "@uiid/utils";

import {
  BUTTON_DEFAULT_SIZE,
  BUTTON_DEFAULT_INTERACTIVE,
} from "./button.constants";
import styles from "./button.module.css";

export const buttonVariants = cva({
  variants: {
    interactive: { true: styles["toggle-interactive"] },
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
      critical: styles["tone-critical"],
      warning: styles["tone-warning"],
      info: styles["tone-info"],
    },
  },
  defaultVariants: {
    size: BUTTON_DEFAULT_SIZE,
    interactive: BUTTON_DEFAULT_INTERACTIVE,
  },
});
