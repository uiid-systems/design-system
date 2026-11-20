import { cva } from "@uiid/utils";

import { badgeColorStyles } from "../badge/badge.variants";

import styles from "./timeline.module.css";

/** Palette color, shared by the root and per-item overrides. */
export const timelineVariants = cva({
  variants: {
    color: badgeColorStyles,
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
