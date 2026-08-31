"use client";

import { PopupLayerItem } from "../../shared/popup-layer";
import type { AutocompleteItemProps } from "../autocomplete.types";

export const AutocompleteItem = (props: AutocompleteItemProps) => {
  return <PopupLayerItem slot="autocomplete-item" {...props} />;
};
AutocompleteItem.displayName = "AutocompleteItem";
