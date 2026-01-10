import * as React from "react";

import { useMaskPattern } from "./use-mask-pattern";
import { useMaskValue } from "./use-mask-value";
import { useMaskValidation, type ValidationMode } from "./use-mask-validation";
import { useMaskHandlers } from "./use-mask-handlers";
import type {
  InputElement,
  MaskPattern,
  MaskPatternKey,
} from "../mask-input.types";

export interface UseMaskOptions {
  /** Predefined mask pattern key or custom mask pattern */
  mask?: MaskPatternKey | MaskPattern;
  /** The controlled value */
  value?: string;
  /** The default value for uncontrolled usage */
  defaultValue?: string;
  /** Callback fired when the value changes */
  onValueChange?: (maskedValue: string, unmaskedValue: string) => void;
  /** Callback fired when validation occurs */
  onValidate?: (isValid: boolean, unmaskedValue: string) => void;
  /** When validation should trigger */
  validationMode?: ValidationMode;
  /** Currency code for currency mask (e.g., "USD", "EUR") */
  currency?: string;
  /** Locale for formatting (e.g., "en-US", "de-DE") */
  locale?: string;
  /** Whether to disable masking */
  withoutMask?: boolean;
  /** Minimum value for percentage validation */
  min?: number | string;
  /** Maximum value for percentage validation */
  max?: number | string;
  /** Override the calculated inputMode */
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** Override the calculated maxLength */
  maxLength?: number;
  /** External focus handler */
  onFocus?: React.FocusEventHandler<InputElement>;
  /** External blur handler */
  onBlur?: React.FocusEventHandler<InputElement>;
  /** External keydown handler */
  onKeyDown?: React.KeyboardEventHandler<InputElement>;
  /** External paste handler */
  onPaste?: React.ClipboardEventHandler<InputElement>;
  /** External composition start handler */
  onCompositionStart?: React.CompositionEventHandler<InputElement>;
  /** External composition end handler */
  onCompositionEnd?: React.CompositionEventHandler<InputElement>;
}

export interface UseMaskReturn {
  /** Ref to attach to the input element */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** The formatted display value */
  displayValue: string;
  /** Whether the input is currently focused */
  focused: boolean;
  /** Whether the input has been touched */
  touched: boolean;
  /** The calculated input mode */
  inputMode: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** The calculated max length */
  maxLength: number | undefined;
  /** Props to spread onto the input element */
  inputProps: {
    value: string;
    inputMode: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    maxLength: number | undefined;
    onChange: React.ChangeEventHandler<InputElement>;
    onFocus: React.FocusEventHandler<InputElement>;
    onBlur: React.FocusEventHandler<InputElement>;
    onKeyDown: React.KeyboardEventHandler<InputElement>;
    onPaste: React.ClipboardEventHandler<InputElement>;
    onCompositionStart: React.CompositionEventHandler<InputElement>;
    onCompositionEnd: React.CompositionEventHandler<InputElement>;
  };
}

/**
 * A comprehensive hook that provides everything needed to build a masked input.
 * Composes useMaskPattern, useMaskValue, useMaskValidation, and useMaskHandlers.
 *
 * @example
 * ```tsx
 * function PhoneInput() {
 *   const { inputRef, inputProps } = useMask({
 *     mask: "phone",
 *     onValueChange: (masked, unmasked) => console.log(unmasked),
 *   });
 *
 *   return <input ref={inputRef} {...inputProps} />;
 * }
 * ```
 */
export function useMask(options: UseMaskOptions): UseMaskReturn {
  const {
    mask,
    value: valueProp,
    defaultValue,
    onValueChange,
    onValidate,
    validationMode,
    currency,
    locale,
    withoutMask,
    min,
    max,
    inputMode,
    maxLength,
    onFocus,
    onBlur,
    onKeyDown,
    onPaste,
    onCompositionStart,
    onCompositionEnd,
  } = options;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    maskPattern,
    transformOpts,
    calculatedInputMode,
    calculatedMaxLength,
  } = useMaskPattern({
    mask,
    currency,
    locale,
    inputMode,
    maxLength,
  });

  const {
    value,
    isControlled,
    displayValue,
    composing,
    setInternalValue,
    setComposing,
  } = useMaskValue({
    value: valueProp,
    defaultValue,
    maskPattern,
    transformOpts,
    mask,
    withoutMask,
  });

  const {
    touched,
    setTouched,
    shouldValidate,
    onInputValidate,
  } = useMaskValidation({
    maskPattern,
    onValidate,
    validationMode,
    min,
    max,
  });

  const {
    focused,
    handleChange,
    handleFocus,
    handleBlur,
    handleKeyDown,
    handlePaste,
    handleCompositionStart,
    handleCompositionEnd,
  } = useMaskHandlers({
    inputRef,
    maskPattern,
    transformOpts,
    mask,
    withoutMask,
    value,
    isControlled,
    setInternalValue,
    composing,
    setComposing,
    touched,
    setTouched,
    shouldValidate,
    onInputValidate,
    onValueChange,
    onValidate,
    onFocus,
    onBlur,
    onKeyDown,
    onPaste,
    onCompositionStart,
    onCompositionEnd,
  });

  return {
    inputRef,
    displayValue,
    focused,
    touched,
    inputMode: calculatedInputMode,
    maxLength: calculatedMaxLength,
    inputProps: {
      value: displayValue,
      inputMode: calculatedInputMode,
      maxLength: calculatedMaxLength,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onPaste: handlePaste,
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
    },
  };
}
