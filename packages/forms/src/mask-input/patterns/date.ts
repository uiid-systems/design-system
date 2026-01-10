import {
  REGEX_CACHE,
  PAST_YEARS_LIMIT,
  FUTURE_YEARS_LIMIT,
  daysInMonthCache,
} from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const datePattern: MaskPattern = {
  pattern: "##/##/####",
  transform: (value) => value.replace(REGEX_CACHE.nonDigits, ""),
  validate: (value) => {
    const cleaned = value.replace(REGEX_CACHE.nonDigits, "");
    if (cleaned.length !== 8) return false;
    const month = parseInt(cleaned.substring(0, 2), 10);
    const day = parseInt(cleaned.substring(2, 4), 10);
    const year = parseInt(cleaned.substring(4, 8), 10);

    const currentYear = new Date().getFullYear();
    const minYear = currentYear - PAST_YEARS_LIMIT;
    const maxYear = currentYear + FUTURE_YEARS_LIMIT;
    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      year < minYear ||
      year > maxYear
    )
      return false;

    const maxDays =
      month === 2 &&
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
        ? 29
        : (daysInMonthCache[month - 1] ?? 31);

    return day <= maxDays;
  },
};
