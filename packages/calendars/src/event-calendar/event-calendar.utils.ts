import {
  addMinutes,
  differenceInMinutes,
  format,
  getMinutes,
  isSameDay,
} from "date-fns";

import type { CalendarEvent, DropTargetData } from "./event-calendar.types";

/** Returns whether a day is the first/last day of an event's span */
export const getEventDayPosition = (event: CalendarEvent, day: Date) => ({
  isFirstDay: isSameDay(day, new Date(event.start)),
  isLastDay: isSameDay(day, new Date(event.end)),
});

/** Chunks an array of days into weeks (groups of 7) */
export const chunkIntoWeeks = <T>(days: T[]): T[][] => {
  const weeks: T[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};

/** Compares two dates, returns true if year/month/day differ */
export const hasDateChanged = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() !== date2.getFullYear() ||
  date1.getMonth() !== date2.getMonth() ||
  date1.getDate() !== date2.getDate();

/** Compares two dates, returns true if year/month/day/hours/minutes differ */
export const hasDateTimeChanged = (date1: Date, date2: Date): boolean =>
  hasDateChanged(date1, date2) ||
  date1.getHours() !== date2.getHours() ||
  date1.getMinutes() !== date2.getMinutes();

/** Rounds a fractional hour to the nearest 15-minute interval */
export const roundToNearest15Minutes = (
  time: number,
): { hours: number; minutes: number } => {
  const hours = Math.floor(time);
  const fractionalHour = time - hours;

  const minutes =
    fractionalHour < 0.125 ? 0 :
    fractionalHour < 0.375 ? 15 :
    fractionalHour < 0.625 ? 30 : 45;

  return { hours, minutes };
};

export const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? "ha" : "h:mma").toLowerCase();
};

/** Calculates display times for events, accounting for drag state */
export const getDisplayTimes = (
  event: { start: Date; end: Date },
  currentTime?: Date,
) => {
  const displayStart = currentTime || new Date(event.start);
  const eventEnd = new Date(event.end);
  const eventStart = new Date(event.start);
  const duration = eventEnd.getTime() - eventStart.getTime();

  const displayEnd = currentTime
    ? new Date(new Date(currentTime).getTime() + duration)
    : eventEnd;

  const durationMinutes = differenceInMinutes(displayEnd, displayStart);

  return { displayStart, displayEnd, durationMinutes };
};

/** Formats event time range based on duration */
export const formatEventTime = (
  displayStart: Date,
  displayEnd: Date,
  durationMinutes: number,
  allDay?: boolean,
) => {
  if (allDay) return "All day";
  if (durationMinutes < 45) return formatTimeWithOptionalMinutes(displayStart);
  return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`;
};

/**
 * Calculates the new time for a dropped event based on drop target data.
 * For week/day views: uses the time from drop target, rounded to 15-min intervals.
 * For month view: preserves the original time, only changes the date.
 */
export const calculateDropTime = (
  dropData: DropTargetData,
  currentTime: Date | null,
  isMonthView: boolean,
): Date => {
  const newTime = new Date(dropData.date);

  if (dropData.time !== undefined && !isMonthView) {
    // Week/day view: set hours/minutes from drop target
    const { hours, minutes } = roundToNearest15Minutes(dropData.time);
    newTime.setHours(hours, minutes, 0, 0);
  } else if (currentTime) {
    // Month view: preserve original time
    newTime.setHours(
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds(),
      currentTime.getMilliseconds(),
    );
  }

  return newTime;
};

/**
 * Calculates updated start/end times for an event being moved.
 * Preserves the original duration.
 */
export const calculateUpdatedEventTimes = (
  event: CalendarEvent,
  newStart: Date,
): { start: Date; end: Date } => {
  const originalStart = new Date(event.start);
  const originalEnd = new Date(event.end);
  const durationMinutes = differenceInMinutes(originalEnd, originalStart);
  const newEnd = addMinutes(newStart, durationMinutes);

  return { start: newStart, end: newEnd };
};

/**
 * Get all events visible on a specific day (starting, ending, or spanning)
 */
export function getAllEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return (
      isSameDay(day, eventStart) ||
      isSameDay(day, eventEnd) ||
      (day > eventStart && day < eventEnd)
    );
  });
}

/**
 * Filter events for a specific day
 */
export function getEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start);
      return isSameDay(day, eventStart);
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: CalendarEvent): boolean {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return event.allDay || eventStart.getDate() !== eventEnd.getDate();
}

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
export function getSpanningEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false;

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Only include if it's not the start day but is either the end day or a middle day
    return (
      !isSameDay(day, eventStart) &&
      (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
    );
  });
}

/**
 * Sort events with multi-day events first, then by start time
 */
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a);
    const bIsMultiDay = isMultiDayEvent(b);

    if (aIsMultiDay && !bIsMultiDay) return -1;
    if (!aIsMultiDay && bIsMultiDay) return 1;

    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });
}
