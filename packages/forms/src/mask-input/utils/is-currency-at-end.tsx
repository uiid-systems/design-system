import { currencyAtEndCache, REGEX_CACHE } from "../mask-input.constants";
import type { TransformOptions } from "../mask-input.types";

import { getCachedFormatter } from "./get-cached-formatter";

export function isCurrencyAtEnd(opts: TransformOptions): boolean {
  const { locale, currency } = opts;

  const key = `${locale}|${currency}`;
  const cached = currencyAtEndCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const formatter = getCachedFormatter(locale, {
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const sample = formatter.format(123);
    const result = REGEX_CACHE.currencyAtEnd.test(sample);
    currencyAtEndCache.set(key, result);
    return result;
  } catch {
    currencyAtEndCache.set(key, false);
    return false;
  }
}
