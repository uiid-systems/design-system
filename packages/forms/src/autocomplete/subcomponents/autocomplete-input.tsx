"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { Field } from "../../field/field";
import { InputControl, InputWrapper } from "../../input/subcomponents";
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
        <BaseAutocomplete.Input
          data-slot="autocomplete-input"
          name={name}
          render={<InputControl inner={hasSlots} fullwidth />}
          className={className}
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
