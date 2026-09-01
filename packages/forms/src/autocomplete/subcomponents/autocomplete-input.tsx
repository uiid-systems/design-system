"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { Field } from "../../field/field";
import { inputControlClassName } from "../../input/input.styles";
import { InputWrapper } from "../../input/subcomponents";
import type { AutocompleteInputProps } from "../autocomplete.types";

export const AutocompleteInput = ({
  label,
  description,
  name,
  onFocus,
  onBlur,
  placeholder,
  before,
  after,
  size,
  color,
  FieldProps,
  className,
  ...props
}: AutocompleteInputProps) => {
  const hasSlots = Boolean(before || after);

  return (
    <Field
      name={name}
      label={label}
      description={description}
      fullwidth
      {...FieldProps}
    >
      {/*
       * The hue goes to both the wrapper and the control because either can be
       * the element wearing the surface. Autocomplete renders no slots by
       * default, so there is usually no wrapper and the `<input>` carries it;
       * pass `before` or `after` and the wrapper appears and carries it instead.
       */}
      <InputWrapper
        before={before}
        after={after}
        size={size}
        color={color}
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
          className={inputControlClassName({
            inner: hasSlots,
            size,
            fullwidth: true,
            color,
            className,
          })}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
AutocompleteInput.displayName = "AutocompleteInput";
