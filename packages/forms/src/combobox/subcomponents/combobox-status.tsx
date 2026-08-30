"use client";

import { PopupLayerStatus } from "../../shared/popup-layer";
import type { ComboboxStatusProps } from "../combobox.types";

export const ComboboxStatus = (props: ComboboxStatusProps) => {
  return <PopupLayerStatus slot="combobox-status" {...props} />;
};
ComboboxStatus.displayName = "ComboboxStatus";
