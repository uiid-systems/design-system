"use client";

import { cx } from "@uiid/utils";

import type { TimelineHeaderProps } from "../timeline.types";
import styles from "../timeline.module.css";

export const TimelineHeader = ({
  className,
  children,
  ...props
}: TimelineHeaderProps) => {
  return (
    <div
      data-slot="timeline-header"
      className={cx(styles["timeline-header"], className)}
      {...props}
    >
      {children}
    </div>
  );
};
TimelineHeader.displayName = "TimelineHeader";
