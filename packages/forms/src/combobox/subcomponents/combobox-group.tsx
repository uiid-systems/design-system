"use client";

import { PopupLayerGroup } from "../../shared/popup-layer";
import type { ComboboxGroupProps } from "../combobox.types";

export const ComboboxGroup = (props: ComboboxGroupProps) => {
  return <PopupLayerGroup slot="combobox-group" {...props} />;
};
ComboboxGroup.displayName = "ComboboxGroup";
