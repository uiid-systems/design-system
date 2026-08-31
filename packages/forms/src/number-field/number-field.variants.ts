import { cva } from "@uiid/utils";

import { NUMBER_FIELD_DEFAULT_SIZE } from "./number-field.constants";

import styles from "./number-field.module.css";

/**
 * Number Field's own size axis, which it used to fake with a template-literal
 * lookup into the CSS module from the component body.
 *
 * The class lands on `NumberFieldGroup` rather than on any one control: the
 * stepper buttons take their width from it as descendants, so the group is the
 * only element that can size them. The input inside paints from Input's shared
 * control surface (`inputControlClassName`), but the axis itself is declared
 * here — aliasing `InputVariants` would put Input's `variant` and `fullwidth` on
 * Number Field's public type with no styles behind them.
 */
export const numberFieldVariants = cva({
  variants: {
    /** Control scale — sizes the stepper buttons and the input together */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: NUMBER_FIELD_DEFAULT_SIZE,
  },
});
