"use client";

import { useMemo } from "react";

import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

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
      isDragging={isDragging}
      currentTime={currentTime}
      dndListeners={dndListeners}
      dndAttributes={dndAttributes}
      className={className}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {children || (
        <>
          {!event.allDay && formatTimeWithOptionalMinutes(displayStart)}{" "}
          {event.title}
        </>
      )}
    </EventWrapper>
  );
};
MonthEvent.displayName = "MonthEvent";
