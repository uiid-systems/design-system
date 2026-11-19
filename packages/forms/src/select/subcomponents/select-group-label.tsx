"use client";

import { Select as BaseSelect } from "@base-ui/react/select";

import { popupLayerGroupLabel } from "../../shared/popup-layer";
import type { SelectGroupLabelProps } from "../select.types";

/** Wears the same group-label treatment as Combobox and Autocomplete. */
export const SelectGroupLabel = ({
  children,
  ...props
}: SelectGroupLabelProps) => {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-group-label"
      render={popupLayerGroupLabel()}
      {...props}
    >
      {children}
    </BaseSelect.GroupLabel>
  );
};
SelectGroupLabel.displayName = "SelectGroupLabel";
