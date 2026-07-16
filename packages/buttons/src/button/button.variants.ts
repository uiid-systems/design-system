import { cva } from "@uiid/utils";

import styles from "./button.module.css";

export const buttonVariants = cva({
  variants: {
    /** Footprint of the button — `square` and `circle` are 1:1 for icon-only buttons (pair with `aria-label`) */
    shape: {
      pill: styles["shape-pill"],
      square: styles["shape-square"],
      circle: styles["shape-circle"],
    },
    /** Stretch to fill the container width */
    fullwidth: { true: styles["fullwidth"] },
    /** Surface treatment — filled by default, `subtle` low-contrast fill, `ghost` transparent, `inverted` background-on-foreground */
    variant: {
      subtle: styles["variant-subtle"],
      ghost: styles["variant-ghost"],
      inverted: styles["variant-inverted"],
    },
    /** Control size, matches form-control rows */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
});
