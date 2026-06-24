"use client";

import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { useTimelineItemContext } from "../timeline.context";
import { CONTENT_NAME } from "../timeline.constants";
import type { TimelineContentProps } from "../timeline.types";
import styles from "../timeline.module.css";

export const TimelineContent = ({
  className,
  children,
  ...props
}: TimelineContentProps) => {
  const { status } = useTimelineItemContext(CONTENT_NAME);

  return (
    <Stack
      data-slot="timeline-content"
      data-status={status}
      className={cx(styles["timeline-content"], className)}
      gap={1}
      fullwidth
      ax="stretch"
      {...props}
    >
      {children}
    </Stack>
  );
};
TimelineContent.displayName = "TimelineContent";
