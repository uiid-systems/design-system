"use client";

import { PopupLayerStatus } from "../../shared/popup-layer";
import type { AutocompleteStatusProps } from "../autocomplete.types";

export const AutocompleteStatus = (props: AutocompleteStatusProps) => {
  return <PopupLayerStatus slot="autocomplete-status" {...props} />;
};
AutocompleteStatus.displayName = "AutocompleteStatus";
