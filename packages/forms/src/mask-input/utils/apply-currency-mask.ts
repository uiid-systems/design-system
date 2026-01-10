import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "../mask-input.constants";

import { getCachedCurrencySymbols } from "./get-cached-currency-symbols";
import { getCachedFormatter } from "./get-cached-formatter";

export function applyCurrencyMask(opts: {
  value: string;
  currency?: string;
  locale?: string;
}): string {
  const { value, currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE } = opts;

  if (!value) return "";

  const {
    currency: currencySymbol,
    decimal: decimalSeparator,
    group: groupSeparator,
  } = getCachedCurrencySymbols({ locale, currency });

  const normalizedValue = value
    .replace(
      new RegExp(
        `\\${groupSeparator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        "g",
      ),
      "",
    )
    .replace(decimalSeparator, ".");

  const parts = normalizedValue.split(".");
  const integerPart = parts[0] ?? "";
  const fractionalPart = parts[1] ?? "";

  if (!integerPart && !fractionalPart) return "";

  const intValue = integerPart ?? "0";
  const fracValue = fractionalPart.slice(0, 2);

  const num = Number(`${intValue}.${fracValue ?? ""}`);

  if (Number.isNaN(num)) {
    const cleanedDigits = value.replace(/[^\d]/g, "");
    if (!cleanedDigits) return "";
    return `${currencySymbol}${cleanedDigits}`;
  }

  const hasExplicitDecimal =
    value.includes(".") || value.includes(decimalSeparator);

  try {
    const formatter = getCachedFormatter(locale, {
      currency,
      minimumFractionDigits: fracValue ? fracValue.length : 0,
      maximumFractionDigits: 2,
    });
    const result = formatter.format(num);

    if (hasExplicitDecimal && !fracValue) {
      if (result.match(/^[^\d\s]+/)) {
        const finalResult = result.replace(/(\d)$/, `$1${decimalSeparator}`);
        return finalResult;
      } else {
        const finalResult = result.replace(
          /(\d)(\s*)([^\d\s]+)$/,
          `$1${decimalSeparator}$2$3`,
        );
        return finalResult;
      }
    }

    return result;
  } catch {
    const formattedInt = intValue.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      groupSeparator,
    );
    let result = `${currencySymbol}${formattedInt}`;
    if (hasExplicitDecimal) {
      result += `${decimalSeparator}${fracValue}`;
    }

    return result;
  }
}
