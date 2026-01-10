import {
  REGEX_CACHE,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
} from "../mask-input.constants";
import { getCachedFormatter } from "../utils/get-cached-formatter";
import type { MaskPattern } from "../mask-input.types";

export const currencyPattern: MaskPattern = {
  pattern: "$###,###.##",
  transform: (
    value,
    { currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE } = {},
  ) => {
    let localeDecimalSeparator = ".";

    try {
      const formatter = getCachedFormatter(locale, {
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      const parts = formatter.formatToParts(1234.5);
      const decimalPart = parts.find((part) => part.type === "decimal");

      if (decimalPart) localeDecimalSeparator = decimalPart.value;
    } catch {
      // Keep defaults
    }

    const cleaned = value.replace(REGEX_CACHE.nonCurrencyChars, "");

    const dotIndex = cleaned.indexOf(".");
    const commaIndex = cleaned.indexOf(",");

    let hasDecimalSeparator = false;
    let decimalIndex = -1;

    if (localeDecimalSeparator === ",") {
      const lastCommaIndex = cleaned.lastIndexOf(",");
      if (lastCommaIndex !== -1) {
        const afterComma = cleaned.substring(lastCommaIndex + 1);
        if (afterComma.length <= 2 && /^\d*$/.test(afterComma)) {
          hasDecimalSeparator = true;
          decimalIndex = lastCommaIndex;
        }
      }

      if (!hasDecimalSeparator && dotIndex !== -1) {
        const afterDot = cleaned.substring(dotIndex + 1);
        if (afterDot.length <= 2 && /^\d*$/.test(afterDot)) {
          hasDecimalSeparator = true;
          decimalIndex = dotIndex;
        }
      }

      if (!hasDecimalSeparator && cleaned.length >= 4) {
        const match = cleaned.match(/^(\d+)\.(\d{3})(\d{1,2})$/);
        if (match) {
          const [, beforeDot, thousandsPart, decimalPart] = match;
          const integerPart = (beforeDot ?? "") + (thousandsPart ?? "");
          const result = `${integerPart}.${decimalPart}`;
          return result;
        }
      }
    } else {
      const lastDotIndex = cleaned.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        const afterDot = cleaned.substring(lastDotIndex + 1);
        if (afterDot.length <= 2 && /^\d*$/.test(afterDot)) {
          hasDecimalSeparator = true;
          decimalIndex = lastDotIndex;
        }
      }

      if (!hasDecimalSeparator && commaIndex !== -1) {
        const afterComma = cleaned.substring(commaIndex + 1);
        const looksLikeThousands = commaIndex <= 3 && afterComma.length >= 3;
        if (
          !looksLikeThousands &&
          afterComma.length <= 2 &&
          /^\d*$/.test(afterComma)
        ) {
          hasDecimalSeparator = true;
          decimalIndex = commaIndex;
        }
      }
    }

    if (hasDecimalSeparator && decimalIndex !== -1) {
      const beforeDecimal = cleaned
        .substring(0, decimalIndex)
        .replace(/[.,]/g, "");
      const afterDecimal = cleaned
        .substring(decimalIndex + 1)
        .replace(/[.,]/g, "");

      if (afterDecimal === "") {
        const result = `${beforeDecimal}.`;
        return result;
      }

      const result = `${beforeDecimal}.${afterDecimal.substring(0, 2)}`;
      return result;
    }

    const digitsOnly = cleaned.replace(/[.,]/g, "");
    return digitsOnly;
  },
  validate: (value) => {
    if (!REGEX_CACHE.currencyValidation.test(value)) return false;
    const num = parseFloat(value);
    return !Number.isNaN(num) && num >= 0;
  },
};
