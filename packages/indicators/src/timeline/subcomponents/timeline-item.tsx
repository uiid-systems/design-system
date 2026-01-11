"use client";

import * as React from "react";
import { Group, Stack } from "@uiid/layout";
import { cx, useComposedRefs } from "@uiid/utils";

import { ITEM_NAME } from "../timeline.constants";
import {
  useTimelineContext,
  useStoreContext,
  TimelineItemContext,
} from "../timeline.context";
import { useIsomorphicLayoutEffect, useStore } from "../timeline.hooks";
import type {
  TimelineStatus,
  ItemElement,
  TimelineItemProps,
  TimelineItemContextValue,
} from "../timeline.types";
import { getItemStatus } from "../timeline.utils";
import { timelineItemVariants } from "../timeline.variants";

export const TimelineItem = ({
  className,
  id,
  ref,
  children,
  ...props
}: TimelineItemProps) => {
  const { dir, orientation, activeIndex } = useTimelineContext(ITEM_NAME);
  const store = useStoreContext(ITEM_NAME);

  const instanceId = React.useId();
  const itemId = id ?? instanceId;
  const itemRef = React.useRef<ItemElement | null>(null);
  const composedRef = useComposedRefs(ref, itemRef);

  const itemIndex = useStore((state) => state.getItemIndex(itemId));

  const status = React.useMemo<TimelineStatus>(() => {
    return getItemStatus(itemIndex, activeIndex);
  }, [activeIndex, itemIndex]);

  useIsomorphicLayoutEffect(() => {
    store.onItemRegister(itemId, itemRef);
    return () => {
      store.onItemUnregister(itemId);
    };
  }, [id, store]);

  const itemContextValue = React.useMemo<TimelineItemContextValue>(
    () => ({ id: itemId, status }),
    [itemId, status],
  );

  const sharedProps = {
    role: "listitem" as const,
    "aria-current": status === "active" ? ("step" as const) : undefined,
    "data-slot": "timeline-item",
    "data-status": status,
    "data-orientation": orientation,
    id: itemId,
    dir,
    ref: composedRef,
    className: cx(timelineItemVariants(), className),
    ...props,
  };

  return (
    <TimelineItemContext.Provider value={itemContextValue}>
      {orientation === "vertical" ? (
        <Group gap={3} pb={4} {...sharedProps}>
          {children}
        </Group>
      ) : (
        <Stack gap={3} {...sharedProps}>
          {children}
        </Stack>
      )}
    </TimelineItemContext.Provider>
  );
};
TimelineItem.displayName = "TimelineItem";
