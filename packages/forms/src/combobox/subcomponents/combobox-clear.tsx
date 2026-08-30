"use client";

import { XIcon } from "@uiid/icons/x";

import { InputGroupClear } from "../../shared/input-group";
import type { ComboboxClearProps } from "../combobox.types";

export const ComboboxClear = ({ children, ...props }: ComboboxClearProps) => {
  return (
    <InputGroupClear
      slot="combobox-clear"
      aria-label="Clear selection"
      {...props}
    >
      {children ?? <XIcon size={14} />}
    </InputGroupClear>
  );
};
ComboboxClear.displayName = "ComboboxClear";
