"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import type { AutocompleteRootProps } from "../autocomplete.types";

export const AutocompleteRoot = <Value,>(
  props: AutocompleteRootProps<Value>,
) => {
  const { children, ...rest } = props;
  return (
    // @ts-expect-error - Base UI has complex overloads for grouped vs flat items
    <BaseAutocomplete.Root data-slot="autocomplete-root" {...rest}>
      {children}
    </BaseAutocomplete.Root>
  );
};
AutocompleteRoot.displayName = "AutocompleteRoot";
