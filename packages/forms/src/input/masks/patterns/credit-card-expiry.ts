import { patternMask } from "../pattern-mask";
import { digitsOf, hasDigits } from "./patterns.utils";

/** How many years ahead `isValidCreditCardExpiry` accepts. */
const FUTURE_YEARS = 50;

/** A card expiry, month and two-digit year, `12/30`. */
export const creditCardExpiryMask = /* @__PURE__ */ patternMask("##/##");

/**
 * Whether a card expiry, masked or not, is a real month that has not passed
 * and is no more than 50 years ahead. A card stays valid through its expiry
 * month. Years up to 75 read as 20xx and later ones as 19xx.
 */
export const isValidCreditCardExpiry = (value: string) => {
  if (!hasDigits(value, 4)) return false;
  const digits = digitsOf(value);
  const month = Number(digits.slice(0, 2));
  const shortYear = Number(digits.slice(2));
  if (month < 1 || month > 12) return false;

  const year = shortYear <= 75 ? 2000 + shortYear : 1900 + shortYear;
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  if (year < thisYear || (year === thisYear && month < thisMonth)) {
    return false;
  }
  return year <= thisYear + FUTURE_YEARS;
};
