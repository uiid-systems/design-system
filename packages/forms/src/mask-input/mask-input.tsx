"use client";

import * as React from "react";

import { cx, useComposedRefs } from "@uiid/utils";
import { ConditionalRender } from "@uiid/layout";

import { Field } from "../field/field";
import { inputVariants } from "../input/input.variants";

import inputStyles from "../input/input.module.css";

import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "./mask-input.constants";

import type { MaskInputProps } from "./mask-input.types";

import { useMask } from "./hooks";

export const MaskInput = (props: MaskInputProps) => {
  const {
    // MaskInput-specific props
    value,
    defaultValue,
    onValueChange,
    onValidate,
    validationMode = "onChange",
    mask,
    maskPlaceholder,
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    invalid = false,
    withoutMask = false,
    // Input variant props
    size,
    fullwidth,
    ghost,
    label,
    description,
    FieldProps,
    // Standard input props
    onBlur,
    onFocus,
    onKeyDown,
    onPaste,
    onCompositionStart,
    onCompositionEnd,
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

  const {
    inputRef,
    displayValue,
    focused,
    inputMode: calculatedInputMode,
    maxLength: calculatedMaxLength,
    inputProps: maskInputProps,
  } = useMask({
    mask,
    value,
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
  });

  const composedRef = useComposedRefs(ref, inputRef);

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
        {...maskInputProps}
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
      />
    </ConditionalRender>
  );
};
MaskInput.displayName = "MaskInput";
