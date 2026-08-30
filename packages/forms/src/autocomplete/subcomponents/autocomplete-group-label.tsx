"use client";

import { PopupLayerGroupLabel } from "../../shared/popup-layer";
import type { AutocompleteGroupLabelProps } from "../autocomplete.types";

export const AutocompleteGroupLabel = (props: AutocompleteGroupLabelProps) => {
  return <PopupLayerGroupLabel slot="autocomplete-group-label" {...props} />;
};
AutocompleteGroupLabel.displayName = "AutocompleteGroupLabel";
