"use client";

import { Text } from "@uiid/typography";

import type { TimelineTimeProps } from "../timeline.types";

export const TimelineTime = ({ children, ...props }: TimelineTimeProps) => {
  return (
    <Text
      data-slot="timeline-time"
      render={<time />}
      shade="accent"
      size={-1}
      {...props}
    >
      {children}
    </Text>
  );
};
TimelineTime.displayName = "TimelineTime";
