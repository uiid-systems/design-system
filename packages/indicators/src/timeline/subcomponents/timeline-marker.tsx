"use client";

import { cx } from "@uiid/utils";

import { MARKER_NAME } from "../timeline.constants";
import { useTimelineItemContext } from "../timeline.context";
import type { TimelineMarkerProps } from "../timeline.types";
import { timelineMarkerVariants, timelineVariants } from "../timeline.variants";

export const TimelineMarker = ({
  color,
  className,
  children,
  ...props
}: TimelineMarkerProps) => {
  const { status } = useTimelineItemContext(MARKER_NAME);
  const variant = children != null ? "content" : "dot";

  return (
    <div
      data-slot="timeline-marker"
      data-variant={variant}
      data-status={status}
      className={cx(
        timelineMarkerVariants({ status }),
        timelineVariants({ color }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TimelineMarker.displayName = "TimelineMarker";
