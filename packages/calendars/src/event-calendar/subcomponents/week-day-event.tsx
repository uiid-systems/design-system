"use client";

import { useMemo } from "react";

import { cx } from "@uiid/utils";

import type { EventItemProps } from "../event-calendar.types";
import {
  formatEventTime,
  formatTimeWithOptionalMinutes,
  getDisplayTimes,
} from "../event-calendar.utils";

import { EventWrapper } from "./event-wrapper";

export type WeekDayEventProps = Omit<EventItemProps, "view"> & {
  view: "week" | "day";
};

export const WeekDayEvent = ({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: WeekDayEventProps) => {
  const { displayStart, displayEnd, durationMinutes } = useMemo(
    () => getDisplayTimes(event, currentTime),
    [event, currentTime],
  );

  const eventTime = useMemo(
    () =>
      formatEventTime(displayStart, displayEnd, durationMinutes, event.allDay),
    [displayStart, displayEnd, durationMinutes, event.allDay],
  );

  const isShort = durationMinutes < 45;

  return (
    <EventWrapper
      event={event}
      isDragging={isDragging}
      onClick={onClick}
      currentTime={currentTime}
      dndListeners={dndListeners}
      dndAttributes={dndAttributes}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className={cx(
        "py-1",
        isShort ? "items-center" : "flex-col",
        view === "week" ? "text-[10px] sm:text-xs" : "text-xs",
        className,
      )}
    >
      {isShort ? (
        <div className="truncate">
          {event.title}{" "}
          {showTime && (
            <span className="opacity-70">
              {formatTimeWithOptionalMinutes(displayStart)}
            </span>
          )}
        </div>
      ) : (
        <>
          <div className="truncate font-medium">{event.title}</div>
          {showTime && (
            <div className="truncate font-normal opacity-70 sm:text-[11px]">
              {eventTime}
            </div>
          )}
        </>
      )}
    </EventWrapper>
  );
};
WeekDayEvent.displayName = "WeekDayEvent";
