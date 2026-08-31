"use client";

import { PopupLayerPopup } from "../../shared/popup-layer";
import type { AutocompletePopupProps } from "../autocomplete.types";

export const AutocompletePopup = (props: AutocompletePopupProps) => {
  return <PopupLayerPopup slot="autocomplete-popup" {...props} />;
};
AutocompletePopup.displayName = "AutocompletePopup";
