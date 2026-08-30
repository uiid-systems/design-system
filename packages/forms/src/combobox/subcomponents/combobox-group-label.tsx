"use client";

import { PopupLayerGroupLabel } from "../../shared/popup-layer";
import type { ComboboxGroupLabelProps } from "../combobox.types";

export const ComboboxGroupLabel = (props: ComboboxGroupLabelProps) => {
  return <PopupLayerGroupLabel slot="combobox-group-label" {...props} />;
};
ComboboxGroupLabel.displayName = "ComboboxGroupLabel";
