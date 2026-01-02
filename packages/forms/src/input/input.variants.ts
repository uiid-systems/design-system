import { cva } from "@uiid/utils";

import styles from "./input.module.css";
import { INPUT_DEFAULT_SIZE } from "./input.constants";

export const inputVariants = cva({
  variants: {
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: INPUT_DEFAULT_SIZE,
  },
});
