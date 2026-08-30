"use client";

import { InputGroupIcon } from "../../shared/input-group";
import type { AutocompleteIconProps } from "../autocomplete.types";

export const AutocompleteIcon = (props: AutocompleteIconProps) => {
  return <InputGroupIcon slot="autocomplete-icon" {...props} />;
};
AutocompleteIcon.displayName = "AutocompleteIcon";
