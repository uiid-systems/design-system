"use client";

import { Select as BaseSelect } from "@base-ui/react/select";

import type { SelectGroupProps } from "../select.types";

export const SelectGroup = ({ children, ...props }: SelectGroupProps) => {
  return (
    <BaseSelect.Group data-slot="select-group" {...props}>
      {children}
    </BaseSelect.Group>
  );
};
SelectGroup.displayName = "SelectGroup";
