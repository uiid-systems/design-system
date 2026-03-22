import { cva } from "@uiid/utils";

import styles from "./status.module.css";

export const statusVariants = cva({
  variants: {
    inverted: { true: styles["toggle-inverted"] },
    pulse: { true: styles["toggle-pulse"] },
  },
});
