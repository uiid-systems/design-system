"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui-components/react/autocomplete";

import type { AutocompletePortalProps } from "../autocomplete.types";

export const AutocompletePortal = ({
  children,
  ...props
}: AutocompletePortalProps) => {
  return (
    <BaseAutocomplete.Portal data-slot="autocomplete-portal" {...props}>
      {children}
    </BaseAutocomplete.Portal>
  );
};
AutocompletePortal.displayName = "AutocompletePortal";

