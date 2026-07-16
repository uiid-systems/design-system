import { cva } from "@uiid/utils";

import styles from "./separator.module.css";

export const separatorVariants = cva({
  variants: {
    /** Axis of the separator line */
    orientation: {
      horizontal: styles["orientation-horizontal"],
      vertical: styles["orientation-vertical"],
    },
    /** Line color from the shade scale */
    shade: {
      background: styles["shade-background"],
      surface: styles["shade-surface"],
      accent: styles["shade-accent"],
      halftone: styles["shade-halftone"],
      muted: styles["shade-muted"],
      foreground: styles["shade-foreground"],
    },
  },
});
