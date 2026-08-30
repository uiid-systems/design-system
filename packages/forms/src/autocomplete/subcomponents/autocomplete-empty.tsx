"use client";

import { PopupLayerEmpty } from "../../shared/popup-layer";
import type { AutocompleteEmptyProps } from "../autocomplete.types";

export const AutocompleteEmpty = (props: AutocompleteEmptyProps) => {
  return <PopupLayerEmpty slot="autocomplete-empty" {...props} />;
};
AutocompleteEmpty.displayName = "AutocompleteEmpty";
