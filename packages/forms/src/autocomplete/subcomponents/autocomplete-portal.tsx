"use client";

import { PopupLayerPortal } from "../../shared/popup-layer";
import type { AutocompletePortalProps } from "../autocomplete.types";

export const AutocompletePortal = (props: AutocompletePortalProps) => {
  return <PopupLayerPortal slot="autocomplete-portal" {...props} />;
};
AutocompletePortal.displayName = "AutocompletePortal";
