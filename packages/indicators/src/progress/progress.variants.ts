import { cva } from "@uiid/utils";

import { badgeColorStyles } from "../badge/badge.variants";
import styles from "./progress.module.css";

export const progressVariants = cva({
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
