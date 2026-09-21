"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Group } from "@uiid/layout";

import type { ComboboxChipsProps } from "../combobox.types";

export const ComboboxChips = ({
  gap = 1,
  ay = "center",
  children,
  ...props
}: ComboboxChipsProps) => {
  return (
    <BaseCombobox.Chips
      data-slot="combobox-chips"
      render={<Group gap={gap} ay={ay} />}
      {...props}
    >
      {children}
    </BaseCombobox.Chips>
  );
};
ComboboxChips.displayName = "ComboboxChips";
