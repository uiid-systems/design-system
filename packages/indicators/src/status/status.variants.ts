import { cva } from "@uiid/utils";

import styles from "./status.module.css";

export const statusVariants = cva({
  variants: {
    pulse: { true: styles["toggle-pulse"] },
    tone: {
      positive: styles["tone-positive"],
      warning: styles["tone-warning"],
      negative: styles["tone-negative"],
      info: styles["tone-info"],
    },
  },
});
