import { cva } from "@uiid/utils";
import { paletteColorStyles } from "@uiid/typography";

import styles from "./badge.module.css";

const coloredClass = styles["colored"];

/** Badge color styles — palette classes combined with badge-specific bg/fg/border derivation */
export const badgeColorStyles = Object.fromEntries(
  Object.entries(paletteColorStyles).map(([key, value]) => [
    key,
    `${value} ${coloredClass}`,
  ]),
) as Record<keyof typeof paletteColorStyles, string>;

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
