import { cva } from "@uiid/utils";

import styles from "./sheet.module.css";

export const sheetVariants = cva({
  variants: {
    side: {
      top: styles["side-top"],
      right: styles["side-right"],
      bottom: styles["side-bottom"],
      left: styles["side-left"],
    },
  },
});
