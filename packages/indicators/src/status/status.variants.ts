import { cva } from "@uiid/utils";

import badgeStyles from "../badge/badge.module.css";
import styles from "./status.module.css";

export const statusVariants = cva({
  variants: {
    inverted: { true: styles["toggle-inverted"] },
    pulse: { true: styles["toggle-pulse"] },
    color: {
      red: badgeStyles["color-red"],
      orange: badgeStyles["color-orange"],
      yellow: badgeStyles["color-yellow"],
      green: badgeStyles["color-green"],
      blue: badgeStyles["color-blue"],
      indigo: badgeStyles["color-indigo"],
      purple: badgeStyles["color-purple"],
    },
  },
});
