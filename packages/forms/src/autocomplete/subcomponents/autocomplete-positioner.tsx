"use client";

import { PopupLayerPositioner } from "../../shared/popup-layer";
import type { AutocompletePositionerProps } from "../autocomplete.types";

export const AutocompletePositioner = (props: AutocompletePositionerProps) => {
  return <PopupLayerPositioner slot="autocomplete-positioner" {...props} />;
};
AutocompletePositioner.displayName = "AutocompletePositioner";
