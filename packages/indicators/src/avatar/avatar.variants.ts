import { cva } from "@uiid/utils";

import styles from "./avatar.module.css";

export const avatarVariants = cva({
  variants: {
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const TITLE_SIZE_VARIANTS = {
  small: 0,
  medium: 1,
  large: 2,
} as const;

export const DESCRIPTION_SIZE_VARIANTS = {
  small: -1,
  medium: 0,
  large: 0,
} as const;
