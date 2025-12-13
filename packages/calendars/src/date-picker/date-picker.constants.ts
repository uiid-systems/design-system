import {
  subDays,
  addDays,
  subMonths,
  addMonths,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subWeeks,
  addWeeks,
} from "date-fns";

const today = new Date();

export const yesterday: Date = subDays(today, 1);
export const tomorrow: Date = addDays(today, 1);

export const oneWeekAgo: Date = subWeeks(today, 1);
export const oneWeekFromNow: Date = addWeeks(today, 1);

export const firstDayOfMonth: Date = startOfMonth(today);
export const lastDayOfMonth: Date = endOfMonth(today);

export const firstDayOfLastMonth: Date = startOfMonth(subMonths(today, 1));
export const lastDayOfLastMonth: Date = endOfMonth(subMonths(today, 1));

export const firstDayOfNextMonth: Date = startOfMonth(addMonths(today, 1));
export const lastDayOfNextMonth: Date = endOfMonth(addMonths(today, 1));

export const firstDayOfYear: Date = startOfYear(today);
export const lastDayOfYear: Date = endOfYear(today);

export const firstDayOfLastYear: Date = startOfYear(subYears(today, 1));
export const lastDayOfLastYear: Date = endOfYear(subYears(today, 1));

export const DATE_FILTERS = {
  yesterday: { date: yesterday, label: "Yesterday" },
  tomorrow: { date: tomorrow, label: "Tomorrow" },
  oneWeekAgo: { date: oneWeekAgo, label: "One week ago" },
  oneWeekFromNow: { date: oneWeekFromNow, label: "One week from now" },
  firstDayOfMonth: { date: firstDayOfMonth, label: "First day of month" },
  lastDayOfMonth: { date: lastDayOfMonth, label: "Last day of month" },
  firstDayOfLastMonth: {
    date: firstDayOfLastMonth,
    label: "First day of last month",
  },
  lastDayOfLastMonth: {
    date: lastDayOfLastMonth,
    label: "Last day of last month",
  },
  firstDayOfNextMonth: {
    date: firstDayOfNextMonth,
    label: "First day of next month",
  },
  lastDayOfNextMonth: {
    date: lastDayOfNextMonth,
    label: "Last day of next month",
  },
  firstDayOfYear: { date: firstDayOfYear, label: "First day of year" },
  lastDayOfYear: { date: lastDayOfYear, label: "Last day of year" },
  firstDayOfLastYear: {
    date: firstDayOfLastYear,
    label: "First day of last year",
  },
  lastDayOfLastYear: {
    date: lastDayOfLastYear,
    label: "Last day of last year",
  },
} as const;
