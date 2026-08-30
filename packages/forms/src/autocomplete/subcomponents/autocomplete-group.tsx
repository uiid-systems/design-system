"use client";

import { PopupLayerGroup } from "../../shared/popup-layer";
import type { AutocompleteGroupProps } from "../autocomplete.types";

export const AutocompleteGroup = (props: AutocompleteGroupProps) => {
  return <PopupLayerGroup slot="autocomplete-group" {...props} />;
};
AutocompleteGroup.displayName = "AutocompleteGroup";
