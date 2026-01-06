import { cva } from "@uiid/utils";

import styles from "./separator.module.css";

export const separatorVariants = cva({
  variants: {
    orientation: {
      horizontal: styles["orientation-horizontal"],
      vertical: styles["orientation-vertical"],
    },
    shade: {
      background: styles["shade-background"],
      surface: styles["shade-surface"],
      muted: styles["shade-muted"],
      halftone: styles["shade-halftone"],
      accent: styles["shade-accent"],
      foreground: styles["shade-foreground"],
    },
  },
});
