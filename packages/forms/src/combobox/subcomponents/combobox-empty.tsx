"use client";

import { PopupLayerEmpty } from "../../shared/popup-layer";
import type { ComboboxEmptyProps } from "../combobox.types";

export const ComboboxEmpty = (props: ComboboxEmptyProps) => {
  return <PopupLayerEmpty slot="combobox-empty" {...props} />;
};
ComboboxEmpty.displayName = "ComboboxEmpty";
