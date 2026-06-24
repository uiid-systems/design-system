"use client";

import { Text } from "@uiid/typography";

import type { TimelineTitleProps } from "../timeline.types";

export const TimelineTitle = ({ children, ...props }: TimelineTitleProps) => {
  return (
    <Text data-slot="timeline-title" size={1} weight="bold" {...props}>
      {children}
    </Text>
  );
};
TimelineTitle.displayName = "TimelineTitle";
