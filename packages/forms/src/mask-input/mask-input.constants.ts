import type { CurrencySymbols } from "./mask-input.types";

export const PAST_YEARS_LIMIT = 120;
export const FUTURE_YEARS_LIMIT = 10;
export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_LOCALE = "en-US";

export const NUMERIC_MASK_PATTERNS =
  /^(phone|zipCode|zipCodeExtended|ssn|ein|time|date|creditCard|creditCardExpiry)$/;
export const CURRENCY_PERCENTAGE_SYMBOLS = /[€$%]/;

export const formattersCache = new Map<string, Intl.NumberFormat>();
export const currencyAtEndCache = new Map<string, boolean>();
export const currencySymbolsCache = new Map<string, CurrencySymbols>();
export const daysInMonthCache = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
] as const;

export const REGEX_CACHE = {
  digitsOnly: /^\d+$/,
  nonDigits: /\D/g,
  nonAlphaNumeric: /[^A-Z0-9]/gi,
  nonNumericDot: /[^0-9.]/g,
  nonCurrencyChars: /[^\d.,]/g,
  hashPattern: /#/g,
  currencyAtEnd: /\d\s*[^\d\s]+$/,
  percentageChars: /[^\d.]/g,
  phone: /^\d{10}$/,
  ssn: /^\d{9}$/,
  zipCode: /^\d{5}$/,
  zipCodeExtended: /^\d{9}$/,
  isbn: /^\d{13}$/,
  ein: /^\d{9}$/,
  time: /^\d{4}$/,
  creditCard: /^\d{13,19}$/,
  creditCardExpiry: /^\d{4}$/,
  licensePlate: /^[A-Z0-9]{6}$/,
  macAddress: /^[A-F0-9]{12}$/,
  currencyValidation: /^\d+(\.\d{1,2})?$/,
  ipv4Segment: /^\d{1,3}$/,
} as const;
