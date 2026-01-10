import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const creditCardExpiryPattern: MaskPattern = {
  pattern: "##/##",
  transform: (value) => value.replace(REGEX_CACHE.nonDigits, ""),
  validate: (value) => {
    const cleaned = value.replace(REGEX_CACHE.nonDigits, "");
    if (!REGEX_CACHE.creditCardExpiry.test(cleaned)) return false;

    const month = parseInt(cleaned.substring(0, 2), 10);
    const year = parseInt(cleaned.substring(2, 4), 10);

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const fullYear = year <= 75 ? 2000 + year : 1900 + year;

    if (
      fullYear < currentYear ||
      (fullYear === currentYear && month < currentMonth)
    ) {
      return false;
    }

    const maxYear = currentYear + 50;
    if (fullYear > maxYear) {
      return false;
    }

    return true;
  },
};
