"use client";

import { PopupLayerItem } from "../../shared/popup-layer";
import type { ComboboxItemProps } from "../combobox.types";

export const ComboboxItem = (props: ComboboxItemProps) => {
  return <PopupLayerItem slot="combobox-item" {...props} />;
};
ComboboxItem.displayName = "ComboboxItem";
