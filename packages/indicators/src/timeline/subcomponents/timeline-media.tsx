"use client";

import { cx } from "@uiid/utils";

import type { TimelineMediaProps } from "../timeline.types";

import styles from "../timeline.module.css";

export const TimelineMedia = ({
  className,
  children,
  ...props
}: TimelineMediaProps) => {
  return (
    <div
      data-slot="timeline-media"
      className={cx(styles["timeline-media"], className)}
      {...props}
    >
      {children}
    </div>
  );
};
TimelineMedia.displayName = "TimelineMedia";
