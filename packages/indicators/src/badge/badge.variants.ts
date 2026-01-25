import { cva } from "@uiid/utils";

import styles from "./badge.module.css";

export const badgeVariants = cva({
  variants: {
    inverted: { true: styles["toggle-inverted"] },
    size: {
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
});
