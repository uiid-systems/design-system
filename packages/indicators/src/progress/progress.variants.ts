import { cva } from "@uiid/utils";

import { PROGRESS_DEFAULT_SIZE } from "./progress.constants";

import styles from "./progress.module.css";

/**
 * Only the size axis lives here. `color` is a palette hue the root pairs with
 * the fill treatment through `paletteClassName`, as Slider does, rather than a
 * variant borrowed from Badge.
 */
export const progressVariants = cva({
  variants: {
    /** Track thickness */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: PROGRESS_DEFAULT_SIZE,
  },
});
