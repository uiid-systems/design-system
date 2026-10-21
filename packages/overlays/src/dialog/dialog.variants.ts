import { cva } from "@uiid/utils";

import styles from "./dialog.module.css";

export const dialogVariants = cva({
  variants: {
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
      xlarge: styles["size-xlarge"],
      full: styles["size-full"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
