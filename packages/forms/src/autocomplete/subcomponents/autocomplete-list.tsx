"use client";

import { PopupLayerList } from "../../shared/popup-layer";
import type { AutocompleteListProps } from "../autocomplete.types";

export const AutocompleteList = (props: AutocompleteListProps) => {
  return <PopupLayerList slot="autocomplete-list" {...props} />;
};
AutocompleteList.displayName = "AutocompleteList";
