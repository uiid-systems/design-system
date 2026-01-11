"use client";

import { cx } from "@uiid/utils";

import { DOT_NAME } from "../timeline.constants";
import { useTimelineItemContext } from "../timeline.context";
import type { TimelineDotProps } from "../timeline.types";
import { timelineDotVariants } from "../timeline.variants";

export const TimelineDot = ({
  className,
  children,
  ...props
}: TimelineDotProps) => {
  const { status } = useTimelineItemContext(DOT_NAME);

  return (
    <div
      data-slot="timeline-dot"
      data-status={status}
      className={cx(timelineDotVariants({ status }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
TimelineDot.displayName = "TimelineDot";
