import { patternMask } from "../pattern-mask";
import { digitsOf, hasDigits } from "./patterns.utils";

/** How many years back and ahead of this one `isValidDate` accepts. */
const PAST_YEARS = 120;
const FUTURE_YEARS = 10;

/** A US date, month first, `12/25/2024`. */
export const dateMask = /* @__PURE__ */ patternMask("##/##/####");

/**
 * Whether a date, masked or not, is a real day: a month from 1 to 12, a day
 * that month has (29 February only in a leap year), and a year from 120 years
 * back to 10 ahead of the current one.
 */
export const isValidDate = (value: string) => {
  if (!hasDigits(value, 8)) return false;
  const digits = digitsOf(value);
  const month = Number(digits.slice(0, 2));
  const day = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4));
  const thisYear = new Date().getFullYear();
  if (year < thisYear - PAST_YEARS || year > thisYear + FUTURE_YEARS) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1) return false;
  // Day 0 of the next month is the last day of this one.
  return day <= new Date(year, month, 0).getDate();
};
