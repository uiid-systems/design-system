"use client";

import { Stack } from "@uiid/layout";

import { CONTENT_NAME } from "../timeline.constants";
import { useTimelineItemContext } from "../timeline.context";
import type { TimelineContentProps } from "../timeline.types";

export const TimelineContent = ({
  children,
  ...props
}: TimelineContentProps) => {
  const { status } = useTimelineItemContext(CONTENT_NAME);

  return (
    <Stack
      data-slot="timeline-content"
      data-status={status}
      gap={3}
      pb={2}
      pr={4}
      {...props}
    >
      {children}
    </Stack>
  );
};
TimelineContent.displayName = "TimelineContent";
