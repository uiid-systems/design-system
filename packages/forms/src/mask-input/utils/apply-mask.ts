import {
  MASK_INPUT_DEFAULT_CURRENCY,
  MASK_INPUT_DEFAULT_LOCALE,
} from "../mask-input.constants";
import type { MaskPatternKey, MaskPattern } from "../mask-input.types";
import { applyCurrencyMask } from "./apply-currency-mask";
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
      currency: currency ?? MASK_INPUT_DEFAULT_CURRENCY,
      locale: locale ?? MASK_INPUT_DEFAULT_LOCALE,
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
