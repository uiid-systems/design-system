"use client";

import { PopupLayerPositioner } from "../../shared/popup-layer";
import type { ComboboxPositionerProps } from "../combobox.types";

export const ComboboxPositioner = (props: ComboboxPositionerProps) => {
  return <PopupLayerPositioner slot="combobox-positioner" {...props} />;
};
ComboboxPositioner.displayName = "ComboboxPositioner";
