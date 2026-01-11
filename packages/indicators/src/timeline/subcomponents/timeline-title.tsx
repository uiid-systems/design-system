"use client";

import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { TimelineTitleProps } from "../timeline.types";
import styles from "../timeline.module.css";

export const TimelineTitle = ({
  className,
  children,
  ...props
}: TimelineTitleProps) => {
  return (
    <Text
      data-slot="timeline-title"
      className={cx(styles["timeline-title"], className)}
      size={1}
      weight="bold"
      {...props}
    >
      {children}
    </Text>
  );
};
TimelineTitle.displayName = "TimelineTitle";
