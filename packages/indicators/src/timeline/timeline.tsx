"use client";

import * as React from "react";
import { useDirection } from "@base-ui/react/direction-provider";

import { Group, Stack, SwitchRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { DEFAULT_ORIENTATION } from "./timeline.constants";
import { StoreContext, TimelineContext } from "./timeline.context";
import { useLazyRef } from "./timeline.hooks";
import type {
  Store,
  StoreState,
  ItemElement,
  TimelineProps,
  TimelineContextValue,
} from "./timeline.types";
import { getItemStatus, getSortedEntries } from "./timeline.utils";
import styles from "./timeline.module.css";

import {
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from "./subcomponents";

export function Timeline({
  orientation = DEFAULT_ORIENTATION,
  dir: dirProp,
  activeIndex,
  items,
  ItemProps,
  DotProps,
  ConnectorProps,
  ContentProps,
  TitleProps,
  DescriptionProps,
  TimeProps,
  className,
  children,
  ...props
}: TimelineProps) {
  const direction = useDirection();
  const dir = dirProp ?? direction ?? "ltr";

  const listenersRef = useLazyRef(() => new Set<() => void>());
  const stateRef = useLazyRef<StoreState>(() => ({
    items: new Map(),
  }));

  const store = React.useMemo<Store>(() => {
    return {
      subscribe: (cb) => {
        listenersRef.current.add(cb);
        return () => listenersRef.current.delete(cb);
      },
      getState: () => stateRef.current,
      notify: () => {
        for (const cb of listenersRef.current) {
          cb();
        }
      },
      onItemRegister: (
        id: string,
        ref: React.RefObject<ItemElement | null>,
      ) => {
        stateRef.current.items.set(id, ref);
        store.notify();
      },
      onItemUnregister: (id: string) => {
        stateRef.current.items.delete(id);
        store.notify();
      },
      getNextItemStatus: (id: string, activeIndex?: number) => {
        const entries = Array.from(stateRef.current.items.entries());
        const sortedEntries = getSortedEntries(entries);

        const currentIndex = sortedEntries.findIndex(([key]) => key === id);
        if (currentIndex === -1 || currentIndex === sortedEntries.length - 1) {
          return undefined;
        }

        const nextItemIndex = currentIndex + 1;
        return getItemStatus(nextItemIndex, activeIndex);
      },
      getItemIndex: (id: string) => {
        const entries = Array.from(stateRef.current.items.entries());
        const sortedEntries = getSortedEntries(entries);
        return sortedEntries.findIndex(([key]) => key === id);
      },
    };
  }, [listenersRef, stateRef]);

  const contextValue = React.useMemo<TimelineContextValue>(
    () => ({
      dir,
      orientation,
      activeIndex,
    }),
    [dir, orientation, activeIndex],
  );

  return (
    <StoreContext.Provider value={store}>
      <TimelineContext.Provider value={contextValue}>
        <SwitchRender
          condition={orientation === "vertical"}
          render={{ true: <Stack gap={2} />, false: <Group gap={2} /> }}
          role="list"
          aria-orientation={orientation}
          data-slot="timeline"
          data-orientation={orientation}
          dir={dir}
          className={cx(styles["timeline"], className)}
          {...props}
        >
          {items
            ? items.map(({ title, description, time }, i) => (
                <TimelineItem key={i} {...ItemProps}>
                  <TimelineDot {...DotProps} />
                  <TimelineConnector {...ConnectorProps} />
                  <TimelineContent {...ContentProps}>
                    <TimelineTitle {...TitleProps}>{title}</TimelineTitle>
                    {time && <TimelineTime {...TimeProps}>{time}</TimelineTime>}
                    {description && (
                      <TimelineDescription {...DescriptionProps}>
                        {description}
                      </TimelineDescription>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))
            : children}
        </SwitchRender>
      </TimelineContext.Provider>
    </StoreContext.Provider>
  );
}
Timeline.displayName = "Timeline";
