import type { MaskPattern } from "../mask-input.types";

import { toUnmaskedIndex } from "./to-unmasked-index";

export function getPatternCaretPosition(opts: {
  newValue: string;
  maskPattern: MaskPattern;
  currentUnmasked: string;
  oldCursorPosition?: number;
  oldValue?: string;
  previousUnmasked?: string;
}): number {
  const {
    newValue,
    maskPattern,
    currentUnmasked,
    oldCursorPosition,
    oldValue,
    previousUnmasked,
  } = opts;
  let position = 0;
  let unmaskedCount = 0;

  if (
    oldCursorPosition !== undefined &&
    oldValue &&
    previousUnmasked !== undefined
  ) {
    const oldUnmaskedIndex = toUnmaskedIndex({
      masked: oldValue,
      pattern: maskPattern.pattern,
      caret: oldCursorPosition,
    });

    if (oldCursorPosition < oldValue.length) {
      const targetUnmaskedIndex = Math.min(
        oldUnmaskedIndex,
        currentUnmasked.length,
      );

      for (
        let i = 0;
        i < maskPattern.pattern.length && i < newValue.length;
        i++
      ) {
        if (maskPattern.pattern[i] === "#") {
          unmaskedCount++;
          if (unmaskedCount <= targetUnmaskedIndex) {
            position = i + 1;
          }
        }
      }

      return position;
    }
  }

  for (let i = 0; i < maskPattern.pattern.length && i < newValue.length; i++) {
    if (maskPattern.pattern[i] === "#") {
      unmaskedCount++;
      if (unmaskedCount <= currentUnmasked.length) {
        position = i + 1;
      }
    }
  }

  return position;
}
