import { cva } from "@uiid/utils";

import styles from "./status.module.css";

export const statusVariants = cva({
  variants: {
    variant: {
      positive: styles["variant-positive"],
      warning: styles["variant-warning"],
      negative: styles["variant-negative"],
      info: styles["variant-info"],
    },
    pulse: {
      true: styles["toggle-pulse"],
    },
  },
});
