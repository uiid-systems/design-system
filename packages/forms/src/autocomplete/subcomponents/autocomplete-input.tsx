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
      <InputWrapper before={before} after={after} fullwidth>
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
            fullwidth: true,
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
