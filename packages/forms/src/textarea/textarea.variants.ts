import { cva } from "@uiid/utils";

import {
  TEXTAREA_DEFAULT_SIZE,
  TEXTAREA_DEFAULT_RESIZE,
} from "./textarea.constants";

import styles from "./textarea.module.css";

export const textareaVariants = cva({
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
    resize: {
      none: styles["resize-none"],
      vertical: styles["resize-vertical"],
      horizontal: styles["resize-horizontal"],
      both: styles["resize-both"],
    },
  },
  defaultVariants: {
    size: TEXTAREA_DEFAULT_SIZE,
    resize: TEXTAREA_DEFAULT_RESIZE,
  },
});
