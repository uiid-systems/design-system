"use client";

import { PopupLayerItem } from "../../shared/popup-layer";
import type { ComboboxItemProps } from "../combobox.types";

export const ComboboxItem = <Value,>(props: ComboboxItemProps<Value>) => {
  return <PopupLayerItem slot="combobox-item" {...props} />;
};
ComboboxItem.displayName = "ComboboxItem";
