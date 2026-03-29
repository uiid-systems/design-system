import { cva } from "@uiid/utils";

import styles from "./badge.module.css";

export const badgeColorStyles = {
  red: styles["color-red"],
  orange: styles["color-orange"],
  yellow: styles["color-yellow"],
  green: styles["color-green"],
  blue: styles["color-blue"],
  indigo: styles["color-indigo"],
  purple: styles["color-purple"],
  neutral: styles["color-neutral"],
};

export const badgeVariants = cva({
  variants: {
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
    color: badgeColorStyles,
  },
  defaultVariants: {
    size: "medium",
  },
});
