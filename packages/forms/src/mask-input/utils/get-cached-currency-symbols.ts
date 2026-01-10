import { currencySymbolsCache } from "../mask-input.constants";
import type { CurrencySymbols, TransformOptions } from "../mask-input.types";

import { getCachedFormatter } from "./get-cached-formatter";

export function getCachedCurrencySymbols(
  opts: TransformOptions,
): CurrencySymbols {
  const { locale, currency } = opts;

  const key = `${locale}|${currency}`;
  const cached = currencySymbolsCache.get(key);
  if (cached) {
    return cached;
  }

  let currencySymbol = "$";
  let decimalSeparator = ".";
  let groupSeparator = ",";

  try {
    const formatter = getCachedFormatter(locale, {
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    const parts = formatter.formatToParts(1234.5);
    const currencyPart = parts.find((part) => part.type === "currency");
    const decimalPart = parts.find((part) => part.type === "decimal");
    const groupPart = parts.find((part) => part.type === "group");

    if (currencyPart) currencySymbol = currencyPart.value;
    if (decimalPart) decimalSeparator = decimalPart.value;
    if (groupPart) groupSeparator = groupPart.value;
  } catch {
    // Keep defaults
  }

  const symbols: CurrencySymbols = {
    currency: currencySymbol,
    decimal: decimalSeparator,
    group: groupSeparator,
  };
  currencySymbolsCache.set(key, symbols);
  return symbols;
}
