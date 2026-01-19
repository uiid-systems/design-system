import { cva } from "@uiid/utils";

import styles from "./tabs.module.css";

export type TabsAlign = "start" | "center" | "end";

export const tabsListVariants = cva({
  base: styles["tabs-list"],
  variants: {
    align: {
      start: styles["align-start"],
      center: styles["align-center"],
      end: styles["align-end"],
    },
  },
  defaultVariants: {
    align: "start",
  },
});
