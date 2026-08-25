"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { List } from "@uiid/lists";

import type { AutocompleteListProps } from "../autocomplete.types";

export const AutocompleteList = ({
  children,
  ...props
}: AutocompleteListProps) => {
  return (
    <BaseAutocomplete.List
      data-slot="autocomplete-list"
      render={<List fullwidth />}
      {...props}
    >
      {children}
    </BaseAutocomplete.List>
  );
};
AutocompleteList.displayName = "AutocompleteList";
