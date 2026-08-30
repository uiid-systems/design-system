"use client";

import { PopupLayerPopup } from "../../shared/popup-layer";
import type { ComboboxPopupProps } from "../combobox.types";

export const ComboboxPopup = (props: ComboboxPopupProps) => {
  return <PopupLayerPopup slot="combobox-popup" {...props} />;
};
ComboboxPopup.displayName = "ComboboxPopup";
