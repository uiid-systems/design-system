"use client";

import { cx } from "@uiid/utils";
import * as React from "react";

import { TimelineItem } from "./subcomponents";
import { TimelineItemContext } from "./timeline.context";
import type {
  TimelineProps,
  TimelineItemContent,
  TimelineItemContextValue,
} from "./timeline.types";
import { getItemStatus, mergeItemProps } from "./timeline.utils";
import { timelineVariants } from "./timeline.variants";

import styles from "./timeline.module.css";

/**
 * Timeline reads each item's position and props from its own children, so
 * items must be direct `TimelineItem` children. Arrays (`events.map(...)`) and
 * fragments are unwrapped; any other wrapper hides the item's props.
 */
function flattenFragments(nodes: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(nodes).flatMap((child) =>
    React.isValidElement<{ children?: React.ReactNode }>(child) &&
    child.type === React.Fragment
      ? // Prefix nested keys with the fragment's so siblings never collide.
        flattenFragments(child.props.children).map((nested) =>
          React.isValidElement(nested)
            ? React.cloneElement(nested, { key: `${child.key}${nested.key}` })
            : nested,
        )
      : [child],
  );
}

function warnOnNonItemChildren(children: React.ReactNode[]) {
  if (process.env.NODE_ENV === "production") return;
  if (
    children.some(
      (child) => React.isValidElement(child) && child.type !== TimelineItem,
    )
  ) {
    console.warn(
      "Timeline: items must be direct children of type TimelineItem. A wrapper " +
        "component hides the item's status, media and marker from the timeline.",
    );
  }
}

export function Timeline({
  items,
  activeIndex,
  defaultStatus,
  color,
  gap,
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
          key={item.id ?? i}
          {...ItemProps}
          {...mergeItemProps(slotProps, item)}
        />
      ))
    : children;

  const itemArray = flattenFragments(nodes);
  warnOnNonItemChildren(itemArray);
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
        <TimelineItemContext.Provider
          key={React.isValidElement(child) ? (child.key ?? index) : index}
          value={contextValues[index]}
        >
          {child}
        </TimelineItemContext.Provider>
      ))}
    </ol>
  );
}
Timeline.displayName = "Timeline";
