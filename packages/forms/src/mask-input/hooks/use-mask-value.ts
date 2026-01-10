import * as React from "react";

import { applyMask, getUnmaskedValue } from "../utils";
import type { MaskPattern, MaskPatternKey, TransformOptions } from "../mask-input.types";

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

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const displayValue = React.useMemo(() => {
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

  return {
    value,
    isControlled,
    displayValue,
    composing,
    setInternalValue,
    setComposing,
  };
}
