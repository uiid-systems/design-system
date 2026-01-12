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
      negative: styles["tone-negative"],
      positive: styles["tone-positive"],
    },
  },
});
