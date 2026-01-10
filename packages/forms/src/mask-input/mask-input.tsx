"use client";

import * as React from "react";

import { cx, useComposedRefs } from "@uiid/utils";
import { ConditionalRender } from "@uiid/layout";

import { Field } from "../field/field";
import { inputVariants } from "../input/input.variants";

import inputStyles from "../input/input.module.css";

import {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  NUMERIC_MASK_PATTERNS,
  CURRENCY_PERCENTAGE_SYMBOLS,
  REGEX_CACHE,
} from "./mask-input.constants";

import type { InputElement, MaskInputProps } from "./mask-input.types";

import {
  applyMask,
  fromUnmaskedIndex,
  getCurrencyCaretPosition,
  getPatternCaretPosition,
  isCurrencyAtEnd,
  isCurrencyMask,
  getUnmaskedValue,
  toUnmaskedIndex,
} from "./utils";

import { MASK_PATTERNS } from "./patterns";

export const MaskInput = (props: MaskInputProps) => {
  const {
    // MaskInput-specific props
    value: valueProp,
    defaultValue,
    onValueChange: onValueChangeProp,
    onValidate,
    validationMode = "onChange",
    mask,
    maskPlaceholder,
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    invalid = false,
    withoutMask = false,
    // Input variant props (passed through to Input)
    size,
    fullwidth,
    ghost,
    label,
    description,
    FieldProps,
    // Standard input props
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    onKeyDown: onKeyDownProp,
    onPaste: onPasteProp,
    onCompositionStart: onCompositionStartProp,
    onCompositionEnd: onCompositionEndProp,
    placeholder,
    inputMode,
    min,
    max,
    maxLength,
    disabled = false,
    readOnly = false,
    required = false,
    className,
    ref,
    ...inputProps
  } = props;

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [focused, setFocused] = React.useState(false);
  const [composing, setComposing] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const composedRef = useComposedRefs(ref, inputRef);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const maskPattern = React.useMemo(() => {
    if (typeof mask === "string") {
      return MASK_PATTERNS[mask];
    }
    return mask;
  }, [mask]);

  const transformOpts = React.useMemo(
    () => ({
      currency,
      locale,
    }),
    [currency, locale],
  );

  const placeholderValue = React.useMemo(() => {
    if (withoutMask) return placeholder;

    if (placeholder && maskPlaceholder) {
      return focused ? maskPlaceholder : placeholder;
    }

    if (maskPlaceholder) {
      return focused ? maskPlaceholder : undefined;
    }

    return placeholder;
  }, [placeholder, maskPlaceholder, focused, withoutMask]);

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

  const tokenCount = React.useMemo(() => {
    if (!maskPattern || CURRENCY_PERCENTAGE_SYMBOLS.test(maskPattern.pattern))
      return undefined;
    return maskPattern.pattern.match(REGEX_CACHE.hashPattern)?.length ?? 0;
  }, [maskPattern]);

  const calculatedMaxLength = tokenCount
    ? maskPattern?.pattern.length
    : maxLength;

  const calculatedInputMode = React.useMemo(() => {
    if (inputMode) return inputMode;
    if (!maskPattern) return undefined;

    if (mask === "currency" || mask === "percentage" || mask === "ipv4") {
      return "decimal";
    }

    if (typeof mask === "string" && NUMERIC_MASK_PATTERNS.test(mask)) {
      return "numeric";
    }
    return undefined;
  }, [maskPattern, mask, inputMode]);

  const shouldValidate = React.useCallback(
    (trigger: "change" | "blur") => {
      if (!onValidate || !maskPattern?.validate) return false;

      switch (validationMode) {
        case "onChange":
          return trigger === "change";
        case "onBlur":
          return trigger === "blur";
        case "onSubmit":
          return false;
        case "onTouched":
          return touched ? trigger === "change" : trigger === "blur";
        case "all":
          return true;
        default:
          return trigger === "change";
      }
    },
    [onValidate, maskPattern, validationMode, touched],
  );

  const validationOpts = React.useMemo(
    () => ({
      min: typeof min === "string" ? parseFloat(min) : min,
      max: typeof max === "string" ? parseFloat(max) : max,
    }),
    [min, max],
  );

  const onInputValidate = React.useCallback(
    (unmaskedValue: string) => {
      if (onValidate && maskPattern?.validate) {
        const isValid = maskPattern.validate(unmaskedValue, validationOpts);
        onValidate(isValid, unmaskedValue);
      }
    },
    [onValidate, maskPattern?.validate, validationOpts],
  );

  const onValueChange = React.useCallback(
    (event: React.ChangeEvent<InputElement>) => {
      const inputValue = event.target.value;
      let newValue = inputValue;
      let unmaskedValue = inputValue;

      if (composing) {
        if (!isControlled) setInternalValue(inputValue);
        return;
      }

      if (withoutMask || !maskPattern) {
        if (!isControlled) setInternalValue(inputValue);
        if (shouldValidate("change")) onValidate?.(true, inputValue);
        onValueChangeProp?.(inputValue, inputValue);
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

          if (CURRENCY_PERCENTAGE_SYMBOLS.test(maskPattern.pattern)) {
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

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (shouldValidate("change")) {
        onInputValidate(unmaskedValue);
      }

      onValueChangeProp?.(newValue, unmaskedValue);
    },
    [
      maskPattern,
      isControlled,
      onValueChangeProp,
      onValidate,
      onInputValidate,
      composing,
      shouldValidate,
      withoutMask,
      transformOpts,
      mask,
      value,
    ],
  );

  const onFocus = React.useCallback(
    (event: React.FocusEvent<InputElement>) => {
      onFocusProp?.(event);
      if (event.defaultPrevented) return;

      setFocused(true);
    },
    [onFocusProp],
  );

  const onBlur = React.useCallback(
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
    ],
  );

  const onCompositionStart = React.useCallback(
    (event: React.CompositionEvent<InputElement>) => {
      onCompositionStartProp?.(event);
      if (event.defaultPrevented) return;

      setComposing(true);
    },
    [onCompositionStartProp],
  );

  const onCompositionEnd = React.useCallback(
    (event: React.CompositionEvent<InputElement>) => {
      onCompositionEndProp?.(event);
      if (event.defaultPrevented) return;

      setComposing(false);

      const inputElement = inputRef.current;
      if (!inputElement) return;
      if (!(inputElement instanceof HTMLInputElement)) return;
      const inputValue = inputElement.value;

      if (!maskPattern || withoutMask) {
        if (!isControlled) setInternalValue(inputValue);
        if (shouldValidate("change")) onValidate?.(true, inputValue);
        onValueChangeProp?.(inputValue, inputValue);
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

      if (!isControlled) setInternalValue(masked);
      if (shouldValidate("change")) onInputValidate(unmasked);
      onValueChangeProp?.(masked, unmasked);
    },
    [
      onCompositionEndProp,
      maskPattern,
      withoutMask,
      isControlled,
      shouldValidate,
      onValidate,
      onValueChangeProp,
      transformOpts,
      mask,
      onInputValidate,
    ],
  );

  const onPaste = React.useCallback(
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

      target.value = newMaskedValue;

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

      if (!isControlled) setInternalValue(newMaskedValue);
      if (shouldValidate("change")) onInputValidate(unmasked);
      onValueChangeProp?.(newMaskedValue, unmasked);
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
      onValueChangeProp,
    ],
  );

  const onKeyDown = React.useCallback(
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

              target.value = nextMasked;
              const nextCaret = fromUnmaskedIndex({
                masked: nextMasked,
                pattern: maskPattern.pattern,
                unmaskedIndex: unmaskedIndex - 1,
              });

              target.setSelectionRange(nextCaret, nextCaret);

              onValueChangeProp?.(nextMasked, nextUnmasked);
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

              target.value = nextMasked;
              const nextCaret = fromUnmaskedIndex({
                masked: nextMasked,
                pattern: maskPattern.pattern,
                unmaskedIndex: unmaskedIndex,
              });

              target.setSelectionRange(nextCaret, nextCaret);

              onValueChangeProp?.(nextMasked, nextUnmasked);
            }
            return;
          }
        }
      }
    },
    [
      maskPattern,
      onKeyDownProp,
      onValueChangeProp,
      transformOpts,
      mask,
      withoutMask,
    ],
  );

  return (
    <ConditionalRender
      condition={Boolean(label || description)}
      render={
        <Field
          name={inputProps.name}
          label={label}
          description={description}
          required={required}
          {...FieldProps}
        />
      }
    >
      <input
        aria-invalid={invalid}
        data-disabled={disabled ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-required={required ? "" : undefined}
        data-slot="mask-input"
        {...inputProps}
        className={cx(
          inputStyles["input"],
          inputVariants({ size, fullwidth, ghost }),
          className,
        )}
        placeholder={placeholderValue}
        ref={composedRef}
        value={displayValue}
        disabled={disabled}
        maxLength={calculatedMaxLength}
        readOnly={readOnly}
        required={required}
        inputMode={calculatedInputMode}
        min={min}
        max={max}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onChange={onValueChange}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      />
    </ConditionalRender>
  );
};
MaskInput.displayName = "MaskInput";
