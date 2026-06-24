"use client";

import { cx } from "@uiid/utils";

import { CONNECTOR_NAME } from "../timeline.constants";
import { useTimelineItemContext } from "../timeline.context";
import type { TimelineConnectorProps } from "../timeline.types";
import { timelineConnectorVariants } from "../timeline.variants";

export const TimelineConnector = ({
  forceMount,
  className,
  ...props
}: TimelineConnectorProps) => {
  const { isLast, connectorActive } = useTimelineItemContext(CONNECTOR_NAME);

  if (isLast && !forceMount) return null;

  return (
    <div
      aria-hidden="true"
      data-slot="timeline-connector"
      data-active={connectorActive ? "" : undefined}
      className={cx(
        timelineConnectorVariants({ active: connectorActive }),
        className,
      )}
      {...props}
    />
  );
};
TimelineConnector.displayName = "TimelineConnector";
