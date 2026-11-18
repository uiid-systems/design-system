"use client";

import { Text } from "@uiid/typography";

import type { TimelineTimeProps } from "../timeline.types";

export const TimelineTime = ({
  children,
  color,
  // Muted with a color reads that hue's fill, near-white on the page, so a
  // colored time keeps the hue as page text, as it did under `shade`.
  emphasis = color ? undefined : "muted",
  ...props
}: TimelineTimeProps) => {
  return (
    <Text
      data-slot="timeline-time"
      render={<time />}
      size={-1}
      color={color}
      emphasis={emphasis}
      {...props}
    >
      {children}
    </Text>
  );
};
TimelineTime.displayName = "TimelineTime";
