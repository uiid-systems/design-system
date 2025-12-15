"use client";

import { useMemo } from "react";

import { cx } from "@uiid/utils";

import type { EventItemProps } from "../event-calendar.types";
import {
  formatTimeWithOptionalMinutes,
  getDisplayTimes,
} from "../event-calendar.utils";

import { EventWrapper } from "./event-wrapper";

export type AgendaEventProps = Omit<EventItemProps, "view" | "showTime">;

export const AgendaEvent = ({
  event,
  isDragging,
  onClick,
  currentTime,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: AgendaEventProps) => {
  const { displayStart, displayEnd } = useMemo(
    () => getDisplayTimes(event, currentTime),
    [event, currentTime],
  );

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
      className={cx("w-full flex-col gap-1 rounded p-2 text-left", className)}
    >
      <div className="text-sm font-medium">{event.title}</div>
      <div className="text-xs opacity-70">
        {event.allDay ? (
          <span>All day</span>
        ) : (
          <span className="uppercase">
            {formatTimeWithOptionalMinutes(displayStart)} -{" "}
            {formatTimeWithOptionalMinutes(displayEnd)}
          </span>
        )}
        {event.location && (
          <>
            <span className="px-1 opacity-35"> · </span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      {event.description && (
        <div className="my-1 text-xs opacity-90">{event.description}</div>
      )}
    </EventWrapper>
  );
};
AgendaEvent.displayName = "AgendaEvent";
