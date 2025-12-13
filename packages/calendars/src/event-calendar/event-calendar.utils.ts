import { differenceInMinutes, format, getMinutes } from "date-fns";

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
