"use client";

import { PopupLayerPortal } from "../../shared/popup-layer";
import type { ComboboxPortalProps } from "../combobox.types";

export const ComboboxPortal = (props: ComboboxPortalProps) => {
  return <PopupLayerPortal slot="combobox-portal" {...props} />;
};
ComboboxPortal.displayName = "ComboboxPortal";
