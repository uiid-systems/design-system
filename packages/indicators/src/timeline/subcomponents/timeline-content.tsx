"use client";

import { ConditionalRender, Stack } from "@uiid/layout";
import { Card } from "@uiid/cards";

import { CONTENT_NAME } from "../timeline.constants";
import { useTimelineItemContext } from "../timeline.context";
import type { TimelineContentProps } from "../timeline.types";

export const TimelineContent = ({
  variant,
  children,
  ...props
}: TimelineContentProps) => {
  const { status } = useTimelineItemContext(CONTENT_NAME);

  return (
    <ConditionalRender condition={variant === "card"} render={<Card />}>
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
    </ConditionalRender>
  );
};
TimelineContent.displayName = "TimelineContent";
