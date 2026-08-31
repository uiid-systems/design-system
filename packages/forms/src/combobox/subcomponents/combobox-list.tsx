"use client";

import { PopupLayerList } from "../../shared/popup-layer";
import type { ComboboxListProps } from "../combobox.types";

export const ComboboxList = (props: ComboboxListProps) => {
  return <PopupLayerList slot="combobox-list" {...props} />;
};
ComboboxList.displayName = "ComboboxList";
