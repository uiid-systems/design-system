import {
  formattersCache,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
} from "../mask-input.constants";

export function getCachedFormatter(
  locale: string | undefined,
  opts: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const {
    currency,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = opts;

  const key = `${locale}|${currency}|${minimumFractionDigits}|${maximumFractionDigits}`;

  if (!formattersCache.has(key)) {
    try {
      formattersCache.set(
        key,
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          ...opts,
        }),
      );
    } catch {
      formattersCache.set(
        key,
        new Intl.NumberFormat(DEFAULT_LOCALE, {
          style: "currency",
          currency: DEFAULT_CURRENCY,
          ...opts,
        }),
      );
    }
  }

  const formatter = formattersCache.get(key);
  if (!formatter) {
    throw new Error(`Failed to create formatter for ${key}`);
  }
  return formatter;
}
