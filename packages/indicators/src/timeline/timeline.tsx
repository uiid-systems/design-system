"use client";

import * as React from "react";
import { cx } from "@uiid/utils";

import { TimelineItemContext } from "./timeline.context";
import type { TimelineProps, TimelineItemContextValue } from "./timeline.types";
import { getItemStatus, isConnectorActive } from "./timeline.utils";
import { timelineVariants } from "./timeline.variants";
import styles from "./timeline.module.css";

import { TimelineItem } from "./subcomponents";

export function Timeline({
  items,
  activeIndex,
  color,
  dir,
  className,
  children,
  ItemProps,
  ...props
}: TimelineProps) {
  const nodes = items
    ? items.map((item, i) => <TimelineItem key={i} {...ItemProps} {...item} />)
    : children;

  const itemArray = React.Children.toArray(nodes);
  const count = itemArray.length;

  const hasMedia = itemArray.some(
    (child) =>
      React.isValidElement<{ media?: React.ReactNode }>(child) &&
      child.props.media != null,
  );

  const contextValues = React.useMemo<TimelineItemContextValue[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        status: getItemStatus(index, activeIndex),
        isLast: index === count - 1,
        connectorActive: isConnectorActive(index, activeIndex),
      })),
    [count, activeIndex],
  );

  return (
    <ol
      data-slot="timeline"
      data-has-media={hasMedia ? "" : undefined}
      className={cx(styles["timeline"], timelineVariants({ color }), className)}
      dir={dir}
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
