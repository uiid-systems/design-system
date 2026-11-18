"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { cxState } from "@uiid/utils";

import {
  popupLayerCard,
  popupLayerPopupClassName,
} from "../../shared/popup-layer";
import type { SelectPopupProps } from "../select.types";

/**
 * Wears the same surface as the Combobox and Autocomplete popups, from
 * `popupLayerCard`. Only the Base UI part differs.
 */
export const SelectPopup = ({
  children,
  className,
  color,
  p,
  gap,
  fullwidth,
  ...props
}: SelectPopupProps) => {
  return (
    <BaseSelect.Popup
      data-slot="select-popup"
      render={popupLayerCard({ color, p, gap, fullwidth })}
      className={cxState(popupLayerPopupClassName, className)}
      {...props}
    >
      {children}
    </BaseSelect.Popup>
  );
};
SelectPopup.displayName = "SelectPopup";
