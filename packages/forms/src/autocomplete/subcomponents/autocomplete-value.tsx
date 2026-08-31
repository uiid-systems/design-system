"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import type { AutocompleteValueProps } from "../autocomplete.types";

export const AutocompleteValue = ({
  children,
  ...props
}: AutocompleteValueProps) => {
  return (
    <BaseAutocomplete.Value data-slot="autocomplete-value" {...props}>
      {children}
    </BaseAutocomplete.Value>
  );
};
AutocompleteValue.displayName = "AutocompleteValue";
