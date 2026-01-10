import type { MaskPatternKey, MaskPattern } from "../mask-input.types";
import type { TransformOptions } from "../mask-input.types";
import { isCurrencyAtEnd } from "./is-currency-at-end";

export function getCurrencyCaretPosition(opts: {
  newValue: string;
  mask: MaskPatternKey | MaskPattern | undefined;
  transformOpts: TransformOptions;
  oldCursorPosition?: number;
  oldValue?: string;
  previousUnmasked?: string;
}): number {
  const {
    newValue,
    mask,
    transformOpts,
    oldCursorPosition,
    oldValue,
    previousUnmasked,
  } = opts;

  if (
    oldCursorPosition !== undefined &&
    oldValue &&
    previousUnmasked !== undefined
  ) {
    if (oldCursorPosition < oldValue.length) {
      const digitsBeforeCursor = oldValue
        .substring(0, oldCursorPosition)
        .replace(/\D/g, "").length;

      let digitCount = 0;
      for (let i = 0; i < newValue.length; i++) {
        if (/\d/.test(newValue[i] ?? "")) {
          digitCount++;
          if (digitCount === digitsBeforeCursor) {
            return i + 1;
          }
        }
      }
    }
  }

  if (mask === "currency") {
    const currencyAtEnd = isCurrencyAtEnd(transformOpts);
    if (currencyAtEnd) {
      const match = newValue.match(/(\d)\s*([^\d\s]+)$/);
      if (match?.[1]) {
        return newValue.lastIndexOf(match[1]) + 1;
      } else {
        return newValue.length;
      }
    } else {
      return newValue.length;
    }
  } else {
    return newValue.length;
  }
}
