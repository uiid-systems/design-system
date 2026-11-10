"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { cxState } from "@uiid/utils";

import { Field } from "../../field/field";
import { inputControlClassName } from "../../input/input.styles";
import { hasInputSlots } from "../../input/input.utils";
import { InputWrapper } from "../../input/subcomponents";
import type { AutocompleteInputProps } from "../autocomplete.types";

export const AutocompleteInput = ({
  label,
  description,
  action,
  name,
  onFocus,
  onBlur,
  placeholder,
  before,
  after,
  size,
  color,
  disabled,
  FieldProps,
  className,
  ...props
}: AutocompleteInputProps) => {
  const hasSlots = hasInputSlots({ before, after });

  return (
    <Field
      name={name}
      label={label}
      description={description}
      action={action}
      disabled={disabled}
      fullwidth
      size={size}
      {...FieldProps}
    >
      {/*
       * The hue goes to whichever element wears the surface. Autocomplete
       * renders no slots by default, so the wrapper is usually a box-less
       * `display: contents` and the `<input>` carries it; pass `before` or
       * `after` and the wrapper paints the surface and carries it instead.
       */}
      <InputWrapper
        before={before}
        after={after}
        size={size}
        color={color}
        disabled={disabled}
        fullwidth
      >
        {/*
         * `name` stops at the Field, which needs it to match a `Form` error.
         * The root already registers this input as the field's control, so
         * rendering a plain `<input>` rather than `InputControl` leaves Base UI
         * to decide whether the input carries the name for submission.
         */}
        <BaseAutocomplete.Input
          data-slot="autocomplete-input"
          render={<input />}
          className={cxState(
            inputControlClassName({
              inner: hasSlots,
              size,
              fullwidth: true,
              color,
            }),
            className,
          )}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
AutocompleteInput.displayName = "AutocompleteInput";
