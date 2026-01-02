import { cva } from "@uiid/utils";

import styles from "./card.module.css";

export const cardVariants = cva({
  variants: {
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
    variant: {
      info: styles["variant-info"],
      warning: styles["variant-warning"],
      negative: styles["variant-negative"],
      positive: styles["variant-positive"],
      inverted: styles["variant-inverted"],
    },
    trimmed: {
      true: styles["toggle-trimmed"],
    },
    transparent: {
      true: styles["toggle-transparent"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
