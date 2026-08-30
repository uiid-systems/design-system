"use client";

import { Select as BaseSelect } from "@base-ui/react/select";

import type { SelectMultipleMode, SelectRootProps } from "../select.types";

export const SelectRoot = <
  Value = string,
  Multiple extends SelectMultipleMode = false,
>({
  children,
  ...props
}: SelectRootProps<Value, Multiple>) => {
  return (
    <BaseSelect.Root data-slot="select-root" {...props}>
      {children}
    </BaseSelect.Root>
  );
};
SelectRoot.displayName = "SelectRoot";
