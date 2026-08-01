import { cva } from "@uiid/utils";

import { badgeColorStyles } from "../badge/badge.variants";

import styles from "./timeline.module.css";

/** Palette color, shared by the root and per-item overrides. */
export const timelineVariants = cva({
  variants: {
    color: badgeColorStyles,
  },
});

export const timelineItemVariants = cva({
  base: styles["timeline-item"],
});

export const timelineMarkerVariants = cva({
  base: styles["timeline-marker"],
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
    active: {
      true: styles["connector-active"],
    },
  },
  defaultVariants: {
    active: false,
  },
});
