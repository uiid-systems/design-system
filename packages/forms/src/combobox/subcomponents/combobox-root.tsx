"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import type { SelectMultipleMode } from "../../select/select.types";

import type { ComboboxRootProps } from "../combobox.types";

export const ComboboxRoot = <Value, Multiple extends SelectMultipleMode = false>({
  children,
  ...props
}: ComboboxRootProps<Value, Multiple>) => {
  return (
    <BaseCombobox.Root data-slot="combobox-root" {...props}>
      {children}
    </BaseCombobox.Root>
  );
};
ComboboxRoot.displayName = "ComboboxRoot";
