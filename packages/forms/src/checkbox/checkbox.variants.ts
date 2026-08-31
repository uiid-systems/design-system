import { cva } from "@uiid/utils";

import styles from "./checkbox.module.css";

export const checkboxVariants = cva({
  variants: {
    bordered: { true: styles["toggle-bordered"] },
    reversed: { true: styles["toggle-reversed"] },
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
});
