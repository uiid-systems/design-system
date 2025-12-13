import { addMinutes, differenceInMinutes, format, getMinutes } from "date-fns";

import type { CalendarEvent, DropTargetData } from "./event-calendar.types";

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
export const roundToNearest15Minutes = (time: number): { hours: number; minutes: number } => {
  const hours = Math.floor(time);
  const fractionalHour = time - hours;

  let minutes = 0;
  if (fractionalHour < 0.125) minutes = 0;
  else if (fractionalHour < 0.375) minutes = 15;
  else if (fractionalHour < 0.625) minutes = 30;
  else minutes = 45;

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
