"use client";

import { Text } from "@uiid/typography";

import type { TimelineDescriptionProps } from "../timeline.types";

export const TimelineDescription = ({
  children,
  ...props
}: TimelineDescriptionProps) => {
  return (
    <Text data-slot="timeline-description" shade="muted" mt={1} {...props}>
      {children}
    </Text>
  );
};
TimelineDescription.displayName = "TimelineDescription";
