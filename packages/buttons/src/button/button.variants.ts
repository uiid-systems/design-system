import { cva } from "@uiid/utils";

import styles from "./button.module.css";

export const buttonVariants = cva({
  variants: {
    /** Boolean */
    grows: { true: styles["toggle-grows"] },
    square: { true: styles["toggle-square"] },
    pill: { true: styles["toggle-pill"] },
    ghost: { true: styles["toggle-ghost"] },
    /** Multivariant */
    variant: {
      subtle: styles["variant-subtle"],
      inverted: styles["variant-inverted"],
    },
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: "medium",
    grows: true,
  },
});
