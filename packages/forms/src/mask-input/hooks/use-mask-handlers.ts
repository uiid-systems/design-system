import * as React from "react";

import { MASK_INPUT_CURRENCY_PERCENTAGE_SYMBOLS } from "../mask-input.constants";
import type {
  InputElement,
  MaskPattern,
  MaskPatternKey,
  TransformOptions,
} from "../mask-input.types";
import {
  applyMask,
  fromUnmaskedIndex,
  getCurrencyCaretPosition,
  getPatternCaretPosition,
  getUnmaskedValue,
  isCurrencyAtEnd,
  isCurrencyMask,
  toUnmaskedIndex,
} from "../utils";

export interface UseMaskHandlersOptions {
  /** Ref to the input element */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** The resolved mask pattern */
  maskPattern: MaskPattern | undefined;
  /** Transform options for currency/locale */
  transformOpts: TransformOptions;
  /** The mask key or pattern */
  mask?: MaskPatternKey | MaskPattern;
  /** Whether masking is disabled */
  withoutMask?: boolean;
  /** Current value */
  value: string;
  /** Whether the component is controlled */
  isControlled: boolean;
  /** Set internal value (uncontrolled mode) */
  setInternalValue: React.Dispatch<React.SetStateAction<string>>;
  /**
   * Whether IME composition is in progress. The handlers keep their own
   * mirror of it, so this is accepted for compatibility and not read.
   */
  composing: boolean;
  /** Set composition state */
  setComposing: React.Dispatch<React.SetStateAction<boolean>>;
  /** Whether input has been touched */
  touched: boolean;
  /** Set touched state */
  setTouched: React.Dispatch<React.SetStateAction<boolean>>;
  /** Check if validation should run */
  shouldValidate: (trigger: "change" | "blur") => boolean;
  /** Run validation */
  onInputValidate: (unmaskedValue: string) => void;
  /** Callback for value changes */
  onValueChange?: (maskedValue: string, unmaskedValue: string) => void;
  /** Callback for validation */
  onValidate?: (isValid: boolean, unmaskedValue: string) => void;
  /**
   * External change handler. Called on each native change event once the
   * masked value is in the input, so `event.target.value` is what is displayed.
   */
  onChange?: React.ChangeEventHandler<InputElement>;
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

export interface UseMaskHandlersReturn {
  /** Whether the input is currently focused */
  focused: boolean;
  /** Handle input change events */
  handleChange: React.ChangeEventHandler<InputElement>;
  /** Handle focus events */
  handleFocus: React.FocusEventHandler<InputElement>;
  /** Handle blur events */
  handleBlur: React.FocusEventHandler<InputElement>;
  /** Handle keydown events (backspace/delete) */
  handleKeyDown: React.KeyboardEventHandler<InputElement>;
  /** Handle paste events */
  handlePaste: React.ClipboardEventHandler<InputElement>;
  /** Handle IME composition start */
  handleCompositionStart: React.CompositionEventHandler<InputElement>;
  /** Handle IME composition end */
  handleCompositionEnd: React.CompositionEventHandler<InputElement>;
}

/**
 * Writes `next` into the input and reports it as an input event, so React
 * routes it through the change handler like a keystroke. The paths that cancel
 * the browser's default action use it to keep one commit path: state,
 * validation, `onValueChange` and a consumer's `onChange` all run from there.
 *
 * The write goes through the prototype setter because React tracks the last
 * value it saw through a setter on the element itself, and drops an input event
 * whose value it already knows. For the same reason nothing is dispatched when
 * the value is unchanged; that returns false so the caller can decide.
 */
function emitInputValue(target: HTMLInputElement, next: string): boolean {
  if (target.value === next) return false;

  const setValue = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(target),
    "value",
  )?.set;
  if (!setValue) return false;

  setValue.call(target, next);
  target.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

/**
 * Provides all event handlers for a masked input, including
 * change, focus, blur, keydown, paste, and IME composition handling.
 */
export function useMaskHandlers(
  options: UseMaskHandlersOptions,
): UseMaskHandlersReturn {
  const {
    inputRef,
    maskPattern,
    transformOpts,
    mask,
    withoutMask = false,
    value,
    isControlled,
    setInternalValue,
    setComposing,
    touched,
    setTouched,
    shouldValidate,
    onInputValidate,
    onValueChange,
    onValidate,
    onChange: onChangeProp,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onKeyDown: onKeyDownProp,
    onPaste: onPasteProp,
    onCompositionStart: onCompositionStartProp,
    onCompositionEnd: onCompositionEndProp,
  } = options;

  const [focused, setFocused] = React.useState(false);

  // Mirrors the `composing` state for the change handler. Composition end
  // reports its value as an input event in the same tick it clears the state,
  // before a render could hand the change handler the new value.
  const composingRef = React.useRef(false);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<InputElement>) => {
      const inputValue = event.target.value;
      let newValue = inputValue;
      let unmaskedValue = inputValue;

      // A consumer's `onChange` is called on every exit below, and without the
      // `defaultPrevented` check focus and blur make: a change has already
      // happened, so there is nothing for the consumer to cancel.
      if (composingRef.current) {
        onChangeProp?.(event);
        if (!isControlled) setInternalValue(inputValue);
        return;
      }

      if (withoutMask || !maskPattern) {
        onChangeProp?.(event);
        if (!isControlled) setInternalValue(inputValue);
        if (shouldValidate("change")) onValidate?.(true, inputValue);
        onValueChange?.(inputValue, inputValue);
        return;
      }

      if (maskPattern) {
        unmaskedValue = getUnmaskedValue({
          value: inputValue,
          transform: maskPattern.transform,
          ...transformOpts,
        });
        newValue = applyMask({
          value: unmaskedValue,
          pattern: maskPattern.pattern,
          ...transformOpts,
          mask,
        });

        if (inputRef.current && newValue !== inputValue) {
          const inputElement = inputRef.current;
          if (!(inputElement instanceof HTMLInputElement)) return;

          const oldCursorPosition = inputElement.selectionStart ?? 0;

          inputElement.value = newValue;

          const currentUnmasked = getUnmaskedValue({
            value: newValue,
            transform: maskPattern.transform,
            ...transformOpts,
          });

          let newCursorPosition: number;

          const previousUnmasked = getUnmaskedValue({
            value,
            transform: maskPattern.transform,
            ...transformOpts,
          });

          if (
            MASK_INPUT_CURRENCY_PERCENTAGE_SYMBOLS.test(maskPattern.pattern)
          ) {
            newCursorPosition = getCurrencyCaretPosition({
              newValue,
              mask,
              transformOpts,
              oldCursorPosition,
              oldValue: inputValue,
              previousUnmasked,
            });
          } else {
            newCursorPosition = getPatternCaretPosition({
              newValue,
              maskPattern,
              currentUnmasked,
              oldCursorPosition,
              oldValue: inputValue,
              previousUnmasked,
            });
          }

          if (isCurrencyMask({ mask, pattern: maskPattern.pattern })) {
            if (mask === "currency") {
              const currencyAtEnd = isCurrencyAtEnd(transformOpts);
              if (!currencyAtEnd) {
                newCursorPosition = Math.max(1, newCursorPosition);
              }
            } else {
              newCursorPosition = Math.max(1, newCursorPosition);
            }
          } else if (maskPattern.pattern.includes("%")) {
            newCursorPosition = Math.min(
              newValue.length - 1,
              newCursorPosition,
            );
          }

          newCursorPosition = Math.min(newCursorPosition, newValue.length);

          inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }

      // The mask is in the DOM by now, so a consumer reading
      // `event.target.value` (a form library's `register()`) gets the value on
      // display rather than the raw keystroke. It runs ahead of `onValueChange`:
      // the native event first, then the reading derived from it.
      onChangeProp?.(event);

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (shouldValidate("change")) {
        onInputValidate(unmaskedValue);
      }

      onValueChange?.(newValue, unmaskedValue);
    },
    [
      maskPattern,
      isControlled,
      onChangeProp,
      onValueChange,
      onValidate,
      onInputValidate,
      shouldValidate,
      withoutMask,
      transformOpts,
      mask,
      value,
      inputRef,
      setInternalValue,
    ],
  );

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<InputElement>) => {
      onFocusProp?.(event);
      if (event.defaultPrevented) return;

      setFocused(true);
    },
    [onFocusProp],
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<InputElement>) => {
      onBlurProp?.(event);
      if (event.defaultPrevented) return;

      setFocused(false);

      if (!touched) {
        setTouched(true);
      }

      if (shouldValidate("blur")) {
        const currentValue = event.target.value;
        const unmaskedValue = maskPattern
          ? getUnmaskedValue({
              value: currentValue,
              transform: maskPattern.transform,
              ...transformOpts,
            })
          : currentValue;
        onInputValidate(unmaskedValue);
      }
    },
    [
      onBlurProp,
      touched,
      shouldValidate,
      onInputValidate,
      maskPattern,
      transformOpts,
      setTouched,
    ],
  );

  const handleCompositionStart = React.useCallback(
    (event: React.CompositionEvent<InputElement>) => {
      onCompositionStartProp?.(event);
      if (event.defaultPrevented) return;

      composingRef.current = true;
      setComposing(true);
    },
    [onCompositionStartProp, setComposing],
  );

  const handleCompositionEnd = React.useCallback(
    (event: React.CompositionEvent<InputElement>) => {
      onCompositionEndProp?.(event);
      if (event.defaultPrevented) return;

      composingRef.current = false;
      setComposing(false);

      const inputElement = inputRef.current;
      if (!inputElement) return;
      if (!(inputElement instanceof HTMLInputElement)) return;
      const inputValue = inputElement.value;

      if (!maskPattern || withoutMask) {
        if (!isControlled) setInternalValue(inputValue);
        if (shouldValidate("change")) onValidate?.(true, inputValue);
        onValueChange?.(inputValue, inputValue);
        return;
      }

      const unmasked = getUnmaskedValue({
        value: inputValue,
        transform: maskPattern.transform,
        ...transformOpts,
      });
      const masked = applyMask({
        value: unmasked,
        pattern: maskPattern.pattern,
        ...transformOpts,
        mask,
      });

      // Masking the composed text changes what is on display, so report it as
      // a change. When it changes nothing the consumer already holds the value
      // from the last change event, and only the commit is left to do.
      if (emitInputValue(inputElement, masked)) return;

      if (!isControlled) setInternalValue(masked);
      if (shouldValidate("change")) onInputValidate(unmasked);
      onValueChange?.(masked, unmasked);
    },
    [
      onCompositionEndProp,
      maskPattern,
      withoutMask,
      isControlled,
      shouldValidate,
      onValidate,
      onValueChange,
      transformOpts,
      mask,
      onInputValidate,
      inputRef,
      setComposing,
      setInternalValue,
    ],
  );

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent<InputElement>) => {
      onPasteProp?.(event);
      if (event.defaultPrevented) return;

      if (withoutMask || !maskPattern) return;

      if (mask === "ipv4") return;

      const target = event.target as InputElement;
      if (!(target instanceof HTMLInputElement)) return;

      const pastedData = event.clipboardData.getData("text");
      if (!pastedData) return;

      event.preventDefault();

      const currentValue = target.value;
      const selectionStart = target.selectionStart ?? 0;
      const selectionEnd = target.selectionEnd ?? 0;

      const beforeSelection = currentValue.slice(0, selectionStart);
      const afterSelection = currentValue.slice(selectionEnd);
      const newInputValue = beforeSelection + pastedData + afterSelection;

      const unmasked = getUnmaskedValue({
        value: newInputValue,
        transform: maskPattern.transform,
        ...transformOpts,
      });
      const newMaskedValue = applyMask({
        value: unmasked,
        pattern: maskPattern.pattern,
        ...transformOpts,
        mask,
      });

      const emitted = emitInputValue(target, newMaskedValue);

      if (isCurrencyMask({ mask, pattern: maskPattern.pattern })) {
        const currencyAtEnd = isCurrencyAtEnd(transformOpts);
        const caret = currencyAtEnd
          ? newMaskedValue.search(/\s*[^\d\s]+$/)
          : newMaskedValue.length;
        target.setSelectionRange(caret, caret);
        return;
      }

      if (maskPattern.pattern.includes("%")) {
        target.setSelectionRange(
          newMaskedValue.length - 1,
          newMaskedValue.length - 1,
        );
        return;
      }

      let newCursorPosition = newMaskedValue.length;
      try {
        const unmaskedCount = unmasked.length;
        let position = 0;
        let count = 0;

        for (
          let i = 0;
          i < maskPattern.pattern.length && i < newMaskedValue.length;
          i++
        ) {
          if (maskPattern.pattern[i] === "#") {
            count++;
            if (count <= unmaskedCount) {
              position = i + 1;
            }
          }
        }
        newCursorPosition = position;
      } catch {
        // fallback to end
      }

      target.setSelectionRange(newCursorPosition, newCursorPosition);

      // A paste that leaves the value as it was has no change to report.
      if (emitted) return;

      if (!isControlled) setInternalValue(newMaskedValue);
      if (shouldValidate("change")) onInputValidate(unmasked);
      onValueChange?.(newMaskedValue, unmasked);
    },
    [
      onPasteProp,
      withoutMask,
      maskPattern,
      mask,
      transformOpts,
      isControlled,
      shouldValidate,
      onInputValidate,
      onValueChange,
      setInternalValue,
    ],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<InputElement>) => {
      onKeyDownProp?.(event);
      if (event.defaultPrevented) return;

      if (withoutMask || !maskPattern) return;

      if (mask === "ipv4") return;

      if (event.key === "Backspace") {
        const target = event.target as InputElement;
        if (!(target instanceof HTMLInputElement)) return;
        const cursorPosition = target.selectionStart ?? 0;
        const selectionEnd = target.selectionEnd ?? 0;
        const currentValue = target.value;

        if (
          mask === "currency" ||
          mask === "percentage" ||
          maskPattern.pattern.includes("$") ||
          maskPattern.pattern.includes("€") ||
          maskPattern.pattern.includes("%")
        ) {
          return;
        }

        if (cursorPosition !== selectionEnd) {
          return;
        }

        if (cursorPosition > 0) {
          const charBeforeCursor = currentValue[cursorPosition - 1];

          if (charBeforeCursor) {
            event.preventDefault();

            const unmaskedIndex = toUnmaskedIndex({
              masked: currentValue,
              pattern: maskPattern.pattern,
              caret: cursorPosition,
            });

            if (unmaskedIndex > 0) {
              const currentUnmasked = getUnmaskedValue({
                value: currentValue,
                transform: maskPattern.transform,
                ...transformOpts,
              });
              const nextUnmasked =
                currentUnmasked.slice(0, unmaskedIndex - 1) +
                currentUnmasked.slice(unmaskedIndex);
              const nextMasked = applyMask({
                value: nextUnmasked,
                pattern: maskPattern.pattern,
                ...transformOpts,
                mask,
              });

              emitInputValue(target, nextMasked);
              const nextCaret = fromUnmaskedIndex({
                masked: nextMasked,
                pattern: maskPattern.pattern,
                unmaskedIndex: unmaskedIndex - 1,
              });

              target.setSelectionRange(nextCaret, nextCaret);
            }
            return;
          }
        }
      }

      if (event.key === "Delete") {
        const target = event.target as InputElement;
        if (!(target instanceof HTMLInputElement)) return;
        const cursorPosition = target.selectionStart ?? 0;
        const selectionEnd = target.selectionEnd ?? 0;
        const currentValue = target.value;

        if (
          mask === "currency" ||
          mask === "percentage" ||
          maskPattern.pattern.includes("$") ||
          maskPattern.pattern.includes("€") ||
          maskPattern.pattern.includes("%")
        ) {
          return;
        }

        if (cursorPosition !== selectionEnd) {
          return;
        }

        if (cursorPosition < currentValue.length) {
          const charAtCursor = currentValue[cursorPosition];

          if (charAtCursor) {
            event.preventDefault();

            const unmaskedIndex = toUnmaskedIndex({
              masked: currentValue,
              pattern: maskPattern.pattern,
              caret: cursorPosition,
            });

            const currentUnmasked = getUnmaskedValue({
              value: currentValue,
              transform: maskPattern.transform,
              ...transformOpts,
            });

            if (unmaskedIndex < currentUnmasked.length) {
              const nextUnmasked =
                currentUnmasked.slice(0, unmaskedIndex) +
                currentUnmasked.slice(unmaskedIndex + 1);
              const nextMasked = applyMask({
                value: nextUnmasked,
                pattern: maskPattern.pattern,
                ...transformOpts,
                mask,
              });

              emitInputValue(target, nextMasked);
              const nextCaret = fromUnmaskedIndex({
                masked: nextMasked,
                pattern: maskPattern.pattern,
                unmaskedIndex: unmaskedIndex,
              });

              target.setSelectionRange(nextCaret, nextCaret);
            }
            return;
          }
        }
      }
    },
    [maskPattern, onKeyDownProp, transformOpts, mask, withoutMask],
  );

  return {
    focused,
    handleChange,
    handleFocus,
    handleBlur,
    handleKeyDown,
    handlePaste,
    handleCompositionStart,
    handleCompositionEnd,
  };
}
