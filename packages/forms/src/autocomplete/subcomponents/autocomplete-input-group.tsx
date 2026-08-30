"use client";

import { InputGroupRoot } from "../../shared/input-group";
import type { AutocompleteInputGroupProps } from "../autocomplete.types";

export const AutocompleteInputGroup = (props: AutocompleteInputGroupProps) => {
  return <InputGroupRoot slot="autocomplete-input-group" {...props} />;
};
AutocompleteInputGroup.displayName = "AutocompleteInputGroup";
