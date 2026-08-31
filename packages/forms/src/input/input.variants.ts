import { cva } from "@uiid/utils";

import { INPUT_DEFAULT_SIZE } from "./input.constants";

import styles from "./input.module.css";

export const inputVariants = cva({
  variants: {
    /** Stretch to fill the container width */
    fullwidth: { true: styles["toggle-fullwidth"] },
    /** Surface treatment — filled by default, `ghost` drops the resting surface */
    variant: {
      ghost: styles["variant-ghost"],
    },
    /** Control size, matches form-control rows */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: INPUT_DEFAULT_SIZE,
  },
});
