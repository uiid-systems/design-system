"use client";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import { ITEM_NAME } from "../timeline.constants";
import { useTimelineItemContext } from "../timeline.context";
import type { TimelineItemProps } from "../timeline.types";
import { timelineItemVariants, timelineVariants } from "../timeline.variants";
import { TimelineConnector } from "./timeline-connector";
import { TimelineContent } from "./timeline-content";
import { TimelineMarker } from "./timeline-marker";
import { TimelineMedia } from "./timeline-media";
import { TimelineTime } from "./timeline-time";

import styles from "../timeline.module.css";

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
  CardProps,
  TitleProps,
  TimeProps,
  DescriptionProps,
  HeadingProps,
  ...props
}: TimelineItemProps) => {
  const { status } = useTimelineItemContext(ITEM_NAME);

  const body =
    content != null || children != null ? (
      <>
        {content}
        {children}
      </>
    ) : undefined;

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
        <Card
          title={title}
          description={description}
          action={
            time != null ? (
              <TimelineTime {...TimeProps}>{time}</TimelineTime>
            ) : undefined
          }
          TitleProps={TitleProps}
          DescriptionProps={DescriptionProps}
          HeaderProps={HeadingProps}
          {...CardProps}
        >
          {body}
        </Card>
      </TimelineContent>
    </li>
  );
};
TimelineItem.displayName = "TimelineItem";
