import * as React from "react";

import type {
  MaskPattern,
  MaskPatternKey,
  TransformOptions,
} from "../mask-input.types";
import { applyMask, getUnmaskedValue } from "../utils";

export interface UseMaskValueOptions {
  /** The controlled value */
  value?: string;
  /** The default value for uncontrolled usage */
  defaultValue?: string;
  /** The resolved mask pattern */
  maskPattern: MaskPattern | undefined;
  /** Transform options for currency/locale */
  transformOpts: TransformOptions;
  /** The mask key or pattern (used for special mask handling) */
  mask?: MaskPatternKey | MaskPattern;
  /** Whether to disable masking */
  withoutMask?: boolean;
}

export interface UseMaskValueReturn {
  /** The current value (controlled or internal) */
  value: string;
  /** Whether the component is controlled */
  isControlled: boolean;
  /** The formatted display value with mask applied */
  displayValue: string;
  /** Whether IME composition is in progress */
  composing: boolean;
  /** Set the internal value (for uncontrolled mode) */
  setInternalValue: React.Dispatch<React.SetStateAction<string>>;
  /** Set composition state */
  setComposing: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * Set the text an open IME composition has produced so far, shown as typed
   * in place of the masked value. `undefined` clears it.
   */
  setComposingText: React.Dispatch<React.SetStateAction<string | undefined>>;
}

/**
 * Manages the value state for a masked input, handling both
 * controlled and uncontrolled modes, and computing the display value.
 */
export function useMaskValue(options: UseMaskValueOptions): UseMaskValueReturn {
  const {
    value: valueProp,
    defaultValue,
    maskPattern,
    transformOpts,
    mask,
    withoutMask = false,
  } = options;

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [composing, setComposing] = React.useState(false);
  const [composingText, setComposingText] = React.useState<string>();

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const maskedValue = React.useMemo(() => {
    if (withoutMask || !maskPattern || !value) return value ?? "";
    const unmasked = getUnmaskedValue({
      value,
      transform: maskPattern.transform,
      ...transformOpts,
    });
    return applyMask({
      value: unmasked,
      pattern: maskPattern.pattern,
      ...transformOpts,
      mask,
    });
  }, [value, maskPattern, withoutMask, transformOpts, mask]);

  // Composing text is shown as typed: masking it would rewrite the input under
  // the IME. Until the composition produces text, the masked value stays up, so
  // starting one changes nothing on display. Composition end applies the mask.
  const displayValue =
    composing && composingText !== undefined ? composingText : maskedValue;

  return {
    value,
    isControlled,
    displayValue,
    composing,
    setInternalValue,
    setComposing,
    setComposingText,
  };
}
