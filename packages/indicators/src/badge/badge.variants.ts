import { paletteVariantStyles } from "@uiid/tokens";
import { cva } from "@uiid/utils";

import styles from "./badge.module.css";

/**
 * Every hue paired with Badge's own bg/fg/border derivation. Avatar, Timeline
 * and Progress import this rather than rebuilding the pairing, so the four wear
 * one treatment.
 */
export const badgeColorStyles = paletteVariantStyles(styles["colored"]);

export const badgeVariants = cva({
  variants: {
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
    color: badgeColorStyles,
  },
  defaultVariants: {
    size: "medium",
  },
});
