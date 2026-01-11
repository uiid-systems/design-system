import { cva } from "@uiid/utils";

import styles from "./modal.module.css";

export const modalVariants = cva({
  variants: {
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
      xlarge: styles["size-xlarge"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
