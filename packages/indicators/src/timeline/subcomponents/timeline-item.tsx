"use client";

import { ConditionalRender, Group, Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { ITEM_NAME } from "../timeline.constants";
import { useTimelineItemContext } from "../timeline.context";
import type { TimelineItemProps } from "../timeline.types";
import { timelineItemVariants, timelineVariants } from "../timeline.variants";
import styles from "../timeline.module.css";

import { TimelineMedia } from "./timeline-media";
import { TimelineMarker } from "./timeline-marker";
import { TimelineConnector } from "./timeline-connector";
import { TimelineContent } from "./timeline-content";
import { TimelineTitle } from "./timeline-title";
import { TimelineTime } from "./timeline-time";
import { TimelineDescription } from "./timeline-description";

export const TimelineItem = ({
  title,
  time,
  description,
  color,
  // Consumed by the Timeline root (folded into context); stripped from the DOM.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  status: _status,
  marker,
  media,
  content,
  className,
  children,
  MediaProps,
  MarkerProps,
  ConnectorProps,
  ContentProps,
  TitleProps,
  TimeProps,
  DescriptionProps,
  HeadingProps,
  ...props
}: TimelineItemProps) => {
  const { status } = useTimelineItemContext(ITEM_NAME);

  const hasHeading = title != null || time != null;

  return (
    <li
      data-slot="timeline-item"
      data-status={status}
      aria-current={status === "active" ? "step" : undefined}
      className={cx(timelineItemVariants(), className)}
      {...props}
    >
      {media != null && <TimelineMedia {...MediaProps}>{media}</TimelineMedia>}

      <div
        data-slot="timeline-rail"
        className={cx(styles["timeline-rail"], timelineVariants({ color }))}
      >
        <div className={styles["timeline-marker-box"]}>
          <TimelineMarker {...MarkerProps}>
            {marker ?? MarkerProps?.children}
          </TimelineMarker>
        </div>
        <TimelineConnector {...ConnectorProps} />
      </div>

      <TimelineContent {...ContentProps}>
        <ConditionalRender condition={hasHeading} render={<Stack />}>
          {hasHeading && (
            <Group
              data-slot="timeline-heading"
              gap={2}
              ay="baseline"
              {...HeadingProps}
            >
              {title != null && (
                <TimelineTitle {...TitleProps}>{title}</TimelineTitle>
              )}
              {time != null && (
                <TimelineTime {...TimeProps}>{time}</TimelineTime>
              )}
            </Group>
          )}
          {description != null && (
            <TimelineDescription {...DescriptionProps}>
              {description}
            </TimelineDescription>
          )}
        </ConditionalRender>
        {content}
        {children}
      </TimelineContent>
    </li>
  );
};
TimelineItem.displayName = "TimelineItem";
