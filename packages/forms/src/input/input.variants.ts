import { cva } from "@uiid/utils";

import { INPUT_DEFAULT_SIZE } from "./input.constants";

import styles from "./input.module.css";

/**
 * The bare control's surface variants. Inside a wrapper that paints the
 * surface, the wrapper takes them instead (`inputWrapperVariants`).
 */
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
      xsmall: styles["input-size-xsmall"],
      small: styles["input-size-small"],
      medium: styles["input-size-medium"],
      large: styles["input-size-large"],
    },
  },
  defaultVariants: {
    size: INPUT_DEFAULT_SIZE,
  },
});

/**
 * The slotted surface's variants. Its size tiers publish
 * `--input-wrapper-height` and `--input-wrapper-padding-x` rather than
 * composing the shared `composes-size-*`, so the slots and the inner control
 * read one size source off the wrapper.
 */
export const inputWrapperVariants = cva({
  variants: {
    fullwidth: { true: styles["toggle-fullwidth"] },
    variant: {
      ghost: styles["variant-ghost"],
    },
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
