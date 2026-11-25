import { cva } from "@uiid/utils";

import { TOGGLE_GROUP_DEFAULT_SIZE } from "./toggle-group.constants";

import styles from "./toggle-group.module.css";

/**
 * The tier rides the toggle buttons, not the panel. `composes-size-*` sets
 * inline padding, font-size and `--forms-icon-size` alongside height, and all
 * three of those belong to the pressable box rather than the container it sits
 * in — composing onto the panel would inset the whole toggle row.
 *
 * The panel takes only its own height, keyed off `data-size`, because the
 * indicator's geometry is measured from it.
 */
export const toggleVariants = cva({
  variants: {
    /** Control size, matches form-control rows */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: TOGGLE_GROUP_DEFAULT_SIZE,
  },
});
