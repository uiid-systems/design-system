import type { MaskPatternKey, MaskPattern } from "../mask-input.types";
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "../mask-input.constants";
import { applyCurrencyMask } from "../mask-input";
import { applyPercentageMask } from "./apply-percentage-mask";

export function applyMask(opts: {
  value: string;
  pattern: string;
  currency?: string;
  locale?: string;
  mask?: MaskPatternKey | MaskPattern;
}): string {
  const { value, pattern, currency, locale, mask } = opts;

  const cleanValue = value;

  if (pattern.includes("$") || pattern.includes("€") || mask === "currency") {
    return applyCurrencyMask({
      value: cleanValue,
      currency: currency ?? DEFAULT_CURRENCY,
      locale: locale ?? DEFAULT_LOCALE,
    });
  }

  if (pattern.includes("%")) {
    return applyPercentageMask(cleanValue);
  }

  if (mask === "ipv4") {
    return cleanValue;
  }

  const maskedChars: string[] = [];
  let valueIndex = 0;

  for (let i = 0; i < pattern.length && valueIndex < cleanValue.length; i++) {
    const patternChar = pattern[i];
    const valueChar = cleanValue[valueIndex];

    if (patternChar === "#" && valueChar) {
      maskedChars.push(valueChar);
      valueIndex++;
    } else if (patternChar) {
      maskedChars.push(patternChar);
    }
  }

  return maskedChars.join("");
}
