"use client";

import { cx } from "@uiid/utils";

import { CONNECTOR_NAME } from "../timeline.constants";
import {
  useTimelineContext,
  useTimelineItemContext,
} from "../timeline.context";
import { useStore } from "../timeline.hooks";
import type { TimelineConnectorProps } from "../timeline.types";
import { timelineConnectorVariants } from "../timeline.variants";

export const TimelineConnector = ({
  forceMount,
  className,
  children,
  ...props
}: TimelineConnectorProps) => {
  const { orientation, activeIndex } = useTimelineContext(CONNECTOR_NAME);
  const { id, status } = useTimelineItemContext(CONNECTOR_NAME);

  const nextItemStatus = useStore((state) =>
    state.getNextItemStatus(id, activeIndex),
  );

  const isLastItem = nextItemStatus === undefined;

  if (!forceMount && isLastItem) return null;

  const isConnectorCompleted =
    nextItemStatus === "completed" || nextItemStatus === "active";

  return (
    <div
      aria-hidden="true"
      data-slot="timeline-connector"
      data-completed={isConnectorCompleted ? "" : undefined}
      data-status={status}
      data-orientation={orientation}
      className={cx(
        timelineConnectorVariants({
          isCompleted: isConnectorCompleted,
          orientation,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TimelineConnector.displayName = "TimelineConnector";
