"use client";

import { Text } from "@uiid/typography";

import type { TimelineTimeProps } from "../timeline.types";

export const TimelineTime = ({ children, ...props }: TimelineTimeProps) => {
  return (
    <Text
      data-slot="timeline-time"
      render={<time />}
      shade="muted"
      size={-1}
      {...props}
    >
      {children}
    </Text>
  );
};
TimelineTime.displayName = "TimelineTime";
