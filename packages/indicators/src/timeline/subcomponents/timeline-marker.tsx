"use client";

import { cx } from "@uiid/utils";

import { MARKER_NAME } from "../timeline.constants";
import { useTimelineItemContext } from "../timeline.context";
import type { TimelineMarkerProps } from "../timeline.types";
import { timelineVariants } from "../timeline.variants";

import styles from "../timeline.module.css";

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
        styles["timeline-marker"],
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
