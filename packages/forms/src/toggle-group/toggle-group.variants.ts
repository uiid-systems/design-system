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

/**
 * The panel's own axis. `fullwidth` stretches the row as a whole, so it lands on
 * the panel; how each toggle then shares that width depends on the orientation,
 * which `.toggle-group-button` resolves by keying off this class.
 */
export const toggleGroupVariants = cva({
  variants: {
    /** Stretch to fill the container width, sharing it evenly between the toggles */
    fullwidth: { true: styles["toggle-fullwidth"] },
  },
});
