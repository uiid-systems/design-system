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

export const yesterday = {
  from: subDays(today, 1),
  to: subDays(today, 1),
};

export const tomorrow = {
  from: today,
  to: addDays(today, 1),
};

export const last7Days = {
  from: subDays(today, 6),
  to: today,
};

export const next7Days = {
  from: addDays(today, 1),
  to: addDays(today, 7),
};

export const last30Days = {
  from: subDays(today, 29),
  to: today,
};

export const monthToDate = {
  from: startOfMonth(today),
  to: today,
};

export const currentMonth = {
  from: startOfMonth(today),
  to: endOfMonth(today),
};

export const lastMonth = {
  from: startOfMonth(subMonths(today, 1)),
  to: endOfMonth(subMonths(today, 1)),
};

export const nextMonth = {
  from: startOfMonth(addMonths(today, 1)),
  to: endOfMonth(addMonths(today, 1)),
};

export const yearToDate = {
  from: startOfYear(today),
  to: today,
};

export const lastYear = {
  from: startOfYear(subYears(today, 1)),
  to: endOfYear(subYears(today, 1)),
};
