import type {
  CurrencyHelpersConfig,
  CurrencyHelpersReturn,
} from "./input-currency.types";

export const useCurrencyHelpers = ({
  locale = "en-US",
  maximumFractionDigits = 2,
  currency = "USD",
}: CurrencyHelpersConfig = {}): CurrencyHelpersReturn => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });

  const toParts = formatter.formatToParts(4);
  const currencySymbol =
    toParts.find(({ type }) => type === "currency")?.value || "";
  const thousandSeparator =
    formatter.formatToParts(11111111).find(({ type }) => type === "group")
      ?.value || "";
  const decimalSeparator =
    formatter.formatToParts(1.1).find(({ type }) => type === "decimal")
      ?.value || "";
  const literalSeparator =
    formatter.formatToParts(1.1).find(({ type }) => type === "literal")
      ?.value || "";

  const isEmpty = (value: unknown): value is null | undefined | "" => {
    return value === null || value === undefined || value === "";
  };

  const isNumber = (value: unknown): value is number => {
    return typeof value === "number" && !isNaN(value);
  };

  const parseToNumberBeforeSubmit = (stringNumber: string | number): number => {
    if (typeof stringNumber === "number") {
      return stringNumber;
    }

    if (isEmpty(stringNumber)) {
      return 0;
    }

    return parseFloat(
      stringNumber
        .replace(currencySymbol, "")
        .replace(literalSeparator, "")
        .replace(new RegExp(`\\${thousandSeparator}`, "g"), "")
        .replace(new RegExp(`\\${decimalSeparator}`), "."),
    );
  };

  const trimExceedingDecimals = (inputString: string): string => {
    const [integer, decimals = ""] = inputString.split(decimalSeparator);
    const trimmedDecimals = decimals.slice(0, maximumFractionDigits);
    return [integer, trimmedDecimals].join(decimalSeparator);
  };

  const sanitizeInput = (input: string | number): string => {
    let cleaned = "";
    let hasDecimalSeparator = false;
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for (const letter of `${input}`) {
      // allowing only one separator
      if (letter === decimalSeparator && !hasDecimalSeparator) {
        cleaned += letter;
        hasDecimalSeparator = true;
        continue;
      }

      if (digits.includes(letter)) {
        cleaned += letter;
      }
    }

    if (hasDecimalSeparator) {
      return trimExceedingDecimals(cleaned);
    }

    return cleaned;
  };

  const normalizeToMaxLength = (inputString: string): string => {
    const sanitized = sanitizeInput(inputString);
    const trimmedExceedingDecimals = trimExceedingDecimals(sanitized);
    return trimmedExceedingDecimals.endsWith(decimalSeparator)
      ? trimmedExceedingDecimals.slice(0, -1)
      : trimmedExceedingDecimals;
  };

  const parseToCleanString = (value: string | number | undefined): string => {
    if (value === formatter.format(0)) {
      return "";
    }

    if (isNumber(value)) {
      return `${value}`.replace(".", decimalSeparator);
    }

    if (isEmpty(value)) {
      return "";
    }

    if (value === currencySymbol) {
      return "";
    }

    if (value === undefined) {
      return "";
    }

    return normalizeToMaxLength(String(value));
  };

  const format = (value: string | number | undefined): string => {
    if (isEmpty(value)) {
      return formatter.format(0);
    }

    const normalizedToMaxLength = normalizeToMaxLength(String(value));
    return formatter.format(parseToNumberBeforeSubmit(normalizedToMaxLength));
  };

  return {
    parseToCleanString,
    format,
    formatter,
    sanitizeInput,
    parseToNumberBeforeSubmit,
  };
};
