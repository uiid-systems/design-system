import { cva } from "@uiid/utils";

import styles from "./checkbox.module.css";

export const checkboxVariants = cva({
  variants: {
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
});
