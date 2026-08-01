import { cva } from "@uiid/utils";

import { INPUT_DEFAULT_SIZE } from "./input.constants";

import styles from "./input.module.css";

export const inputVariants = cva({
  variants: {
    fullwidth: { true: styles["toggle-fullwidth"] },
    ghost: { true: styles["toggle-ghost"] },
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
