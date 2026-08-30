"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { XIcon } from "@uiid/icons/x";

import type { ComboboxChipRemoveProps } from "../combobox.types";

export const ComboboxChipRemove = ({
  children,
  ...props
}: ComboboxChipRemoveProps) => {
  return (
    <BaseCombobox.ChipRemove
      data-slot="combobox-chip-remove"
      aria-label="Remove"
      {...props}
    >
      {children ?? <XIcon size={12} />}
    </BaseCombobox.ChipRemove>
  );
};
ComboboxChipRemove.displayName = "ComboboxChipRemove";
