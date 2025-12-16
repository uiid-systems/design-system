import { format, addDays, startOfWeek } from "date-fns";

// Number of days to show in the agenda view
export const AGENDA_DAYS_TO_SHOW = 30;

// Start and end hours for the week and day views
export const START_HOUR = 0;
export const END_HOUR = 24;

// Default start and end times
export const DEFAULT_START_HOUR = 9; // 9 AM
export const DEFAULT_END_HOUR = 10; // 10 AM

export const WEEKDAYS = Array.from({ length: 7 }, (_, i) =>
  format(addDays(startOfWeek(new Date()), i), "EEE"),
);
