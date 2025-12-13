"use client";

import React, { useMemo } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { isPast } from "date-fns";

import { cx } from "@uiid/utils";

import type { CalendarEvent } from "../event-calendar.types";

import styles from "./event-wrapper.module.css";

export type EventWrapperProps = React.PropsWithChildren<{
  event: CalendarEvent;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isDragging?: boolean;
  currentTime?: Date;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  className?: string;
}>;

export const EventWrapper = ({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) => {
  const isEventInPast = useMemo(() => {
    if (!currentTime) return isPast(new Date(event.end));

    const duration =
      new Date(event.end).getTime() - new Date(event.start).getTime();
    const displayEnd = new Date(new Date(currentTime).getTime() + duration);

    return isPast(displayEnd);
  }, [currentTime, event.end, event.start]);

  return (
    <button
      className={cx(styles["event-wrapper"], className)}
      data-first-day={isFirstDay || undefined}
      data-last-day={isLastDay || undefined}
      data-dragging={isDragging || undefined}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      {children}
    </button>
  );
};
EventWrapper.displayName = "EventWrapper";
