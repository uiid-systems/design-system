"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import type {
  EventVisibilityOptions,
  EventVisibilityResult,
} from "../event-calendar.types";

/**
 * Hook for calculating event visibility based on container height.
 * Uses ResizeObserver for efficient updates.
 */
export const useEventVisibility = ({
  eventHeight,
  eventGap,
}: EventVisibilityOptions): EventVisibilityResult => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const updateHeight = () => setContentHeight(element.clientHeight);

    // Initial measurement
    updateHeight();

    // Observe for resizes
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getVisibleEventCount = useCallback(
    (totalEvents: number): number => {
      if (!contentHeight) return totalEvents;

      const maxEvents = Math.floor(contentHeight / (eventHeight + eventGap));

      // Reserve space for "more" button if needed
      if (totalEvents <= maxEvents) return totalEvents;
      return Math.max(0, maxEvents - 1);
    },
    [contentHeight, eventHeight, eventGap],
  );

  return {
    contentRef: contentRef as React.RefObject<HTMLDivElement>,
    contentHeight,
    getVisibleEventCount,
  };
};
