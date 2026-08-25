import { MASK_INPUT_REGEX } from "../mask-input.constants";
import type { TransformOptions } from "../mask-input.types";

export function getUnmaskedValue(opts: {
  value: string;
  currency?: string;
  locale?: string;
  transform?: (value: string, opts?: TransformOptions) => string;
}): string {
  const { value, transform, currency, locale } = opts;

  return transform
    ? transform(value, { currency, locale })
    : value.replace(MASK_INPUT_REGEX.nonDigits, "");
}
