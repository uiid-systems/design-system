"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import type { ComboboxChipProps } from "../combobox.types";

export const ComboboxChip = ({ children, ...props }: ComboboxChipProps) => {
  return (
    <BaseCombobox.Chip data-slot="combobox-chip" {...props}>
      {children}
    </BaseCombobox.Chip>
  );
};
ComboboxChip.displayName = "ComboboxChip";
