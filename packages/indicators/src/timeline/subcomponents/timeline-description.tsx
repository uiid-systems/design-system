"use client";

import { Text } from "@uiid/typography";

import type { TimelineDescriptionProps } from "../timeline.types";

export const TimelineDescription = ({
  children,
  ...props
}: TimelineDescriptionProps) => {
  return (
    <Text data-slot="timeline-description" shade="muted" size={0} {...props}>
      {children}
    </Text>
  );
};
TimelineDescription.displayName = "TimelineDescription";
