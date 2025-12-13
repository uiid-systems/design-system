"use client";

import { useMemo } from "react";

import { cx } from "@uiid/utils";

import type { EventItemProps } from "../event-calendar.types";
import {
  formatTimeWithOptionalMinutes,
  getDisplayTimes,
} from "../event-calendar.utils";

import { EventWrapper } from "./event-wrapper";

export type MonthEventProps = Omit<EventItemProps, "view" | "showTime">;

export const MonthEvent = ({
  event,
  isDragging,
  onClick,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: MonthEventProps) => {
  const { displayStart } = useMemo(
    () => getDisplayTimes(event, currentTime),
    [event, currentTime],
  );

  return (
    <EventWrapper
      event={event}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
      isDragging={isDragging}
      onClick={onClick}
      currentTime={currentTime}
      dndListeners={dndListeners}
      dndAttributes={dndAttributes}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className={cx(
        "mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-xs",
        className,
      )}
    >
      {children || (
        <span className="truncate">
          {!event.allDay && (
            <span className="truncate font-normal opacity-70 sm:text-[11px]">
              {formatTimeWithOptionalMinutes(displayStart)}{" "}
            </span>
          )}
          {event.title}
        </span>
      )}
    </EventWrapper>
  );
};
MonthEvent.displayName = "MonthEvent";
