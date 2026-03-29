import { cva } from "@uiid/utils";

import styles from "./accordion.module.css";
import { ACCORDION_DEFAULT_SIZE } from "./accordion.constants";

export const accordionTriggerVariants = cva({
  variants: {
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: ACCORDION_DEFAULT_SIZE,
  },
});

export const accordionPanelVariants = cva({
  variants: {
    size: {
      small: styles["panel-size-small"],
      medium: styles["panel-size-medium"],
      large: styles["panel-size-large"],
    },
  },
  defaultVariants: {
    size: ACCORDION_DEFAULT_SIZE,
  },
});

export const accordionRootVariants = cva({
  variants: {
    ghost: { true: styles["toggle-ghost"] },
  },
});
