"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import type { ComboboxValueProps } from "../combobox.types";

export const ComboboxValue = ({ children, ...props }: ComboboxValueProps) => {
  return (
    <BaseCombobox.Value data-slot="combobox-value" {...props}>
      {children}
    </BaseCombobox.Value>
  );
};
ComboboxValue.displayName = "ComboboxValue";
