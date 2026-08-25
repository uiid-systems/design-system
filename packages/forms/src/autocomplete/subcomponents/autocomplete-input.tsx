"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { Input } from "../../input/input";
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
  ...props
}: AutocompleteInputProps) => {
  return (
    <BaseAutocomplete.Input
      data-slot="autocomplete-input"
      name={name}
      render={
        <Input
          name={name}
          label={label}
          description={description}
          before={before}
          after={after}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      }
      placeholder={placeholder}
      {...props}
    />
  );
};
AutocompleteInput.displayName = "AutocompleteInput";
