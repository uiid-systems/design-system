"use client";

import { PopupLayerItem } from "../../shared/popup-layer";
import type { AutocompleteItemProps } from "../autocomplete.types";

export const AutocompleteItem = <Value,>(
  props: AutocompleteItemProps<Value>,
) => {
  return <PopupLayerItem slot="autocomplete-item" {...props} />;
};
AutocompleteItem.displayName = "AutocompleteItem";
