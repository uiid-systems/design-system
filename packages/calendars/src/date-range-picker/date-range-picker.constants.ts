import type { DateRange } from "react-day-picker";

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
} from "date-fns";

const today = new Date();

export const yesterday: DateRange = {
  from: subDays(today, 1),
  to: subDays(today, 1),
};

export const tomorrow: DateRange = {
  from: today,
  to: addDays(today, 1),
};

export const last7Days: DateRange = {
  from: subDays(today, 6),
  to: today,
};

export const next7Days: DateRange = {
  from: addDays(today, 1),
  to: addDays(today, 7),
};

export const last30Days: DateRange = {
  from: subDays(today, 29),
  to: today,
};

export const monthToDate: DateRange = {
  from: startOfMonth(today),
  to: today,
};

export const currentMonth: DateRange = {
  from: startOfMonth(today),
  to: endOfMonth(today),
};

export const lastMonth: DateRange = {
  from: startOfMonth(subMonths(today, 1)),
  to: endOfMonth(subMonths(today, 1)),
};

export const nextMonth: DateRange = {
  from: startOfMonth(addMonths(today, 1)),
  to: endOfMonth(addMonths(today, 1)),
};

export const yearToDate: DateRange = {
  from: startOfYear(today),
  to: today,
};

export const lastYear: DateRange = {
  from: startOfYear(subYears(today, 1)),
  to: endOfYear(subYears(today, 1)),
};

export const DATE_RANGE_FILTERS = {
  yesterday: { range: yesterday, label: "Yesterday" },
  tomorrow: { range: tomorrow, label: "Tomorrow" },
  last7Days: { range: last7Days, label: "Last 7 days" },
  next7Days: { range: next7Days, label: "Next 7 days" },
  last30Days: { range: last30Days, label: "Last 30 days" },
  monthToDate: { range: monthToDate, label: "Month to date" },
  currentMonth: { range: currentMonth, label: "Current month" },
  lastMonth: { range: lastMonth, label: "Last month" },
  nextMonth: { range: nextMonth, label: "Next month" },
  yearToDate: { range: yearToDate, label: "Year to date" },
  lastYear: { range: lastYear, label: "Last year" },
} as const;
