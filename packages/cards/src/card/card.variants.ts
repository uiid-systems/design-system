import { cva } from "@uiid/utils";

import styles from "./card.module.css";

export const cardVariants = cva({
  variants: {
    inverted: { true: styles["toggle-inverted"] },
    trimmed: { true: styles["toggle-trimmed"] },
    transparent: { true: styles["toggle-transparent"] },
    ghost: { true: styles["toggle-ghost"] },
    tone: {
      info: styles["tone-info"],
      warning: styles["tone-warning"],
      critical: styles["tone-critical"],
      positive: styles["tone-positive"],
    },
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
});
