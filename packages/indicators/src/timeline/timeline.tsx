"use client";

import * as React from "react";
import { cx } from "@uiid/utils";

import { TimelineItemContext } from "./timeline.context";
import type {
  TimelineProps,
  TimelineItemContent,
  TimelineItemContextValue,
} from "./timeline.types";
import { getItemStatus, mergeItemProps } from "./timeline.utils";
import { timelineVariants } from "./timeline.variants";
import styles from "./timeline.module.css";

import { TimelineItem } from "./subcomponents";

export function Timeline({
  items,
  activeIndex,
  defaultStatus,
  color,
  gap,
  dir,
  className,
  style,
  children,
  ItemProps,
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
}: TimelineProps) {
  const slotProps = {
    MediaProps,
    MarkerProps,
    ConnectorProps,
    ContentProps,
    CardProps,
    TitleProps,
    TimeProps,
    DescriptionProps,
    HeadingProps,
  };

  const nodes = items
    ? items.map((item, i) => (
        <TimelineItem
          key={i}
          {...ItemProps}
          {...mergeItemProps(slotProps, item)}
        />
      ))
    : children;

  const itemArray = React.Children.toArray(nodes);
  const count = itemArray.length;

  const itemContent = (child: React.ReactNode): TimelineItemContent =>
    React.isValidElement<TimelineItemContent>(child) ? child.props : {};

  const hasMedia = itemArray.some((child) => itemContent(child).media != null);
  const hasMarkers = itemArray.some(
    (child) => itemContent(child).marker != null,
  );

  const contextValues: TimelineItemContextValue[] = itemArray.map(
    (child, index) => {
      const status =
        itemContent(child).status ??
        getItemStatus(index, activeIndex, defaultStatus);
      return {
        index,
        status,
        isLast: index === count - 1,
        connectorActive: status === "completed",
      };
    },
  );

  return (
    <ol
      data-slot="timeline"
      data-has-media={hasMedia ? "" : undefined}
      data-has-markers={hasMarkers ? "" : undefined}
      className={cx(styles["timeline"], timelineVariants({ color }), className)}
      dir={dir}
      style={
        gap !== undefined
          ? ({
              "--timeline-row-gap": `calc(${gap} * var(--spacing-unit))`,
              ...style,
            } as React.CSSProperties)
          : style
      }
      {...props}
    >
      {itemArray.map((child, index) => (
        <TimelineItemContext.Provider key={index} value={contextValues[index]}>
          {child}
        </TimelineItemContext.Provider>
      ))}
    </ol>
  );
}
Timeline.displayName = "Timeline";
