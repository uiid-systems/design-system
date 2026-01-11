import { cva } from "@uiid/utils";

import styles from "./timeline.module.css";

export const timelineItemVariants = cva({
  base: styles["timeline-item"],
});

export const timelineDotVariants = cva({
  base: styles["timeline-dot"],
  variants: {
    status: {
      completed: styles["status-completed"],
      active: styles["status-active"],
      pending: styles["status-pending"],
    },
  },
  defaultVariants: {
    status: "pending",
  },
});

export const timelineConnectorVariants = cva({
  base: styles["timeline-connector"],
  variants: {
    isCompleted: {
      true: styles["completed"],
    },
    orientation: {
      vertical: styles["orientation-vertical"],
      horizontal: styles["orientation-horizontal"],
    },
  },
  defaultVariants: {
    isCompleted: false,
    orientation: "vertical",
  },
});
