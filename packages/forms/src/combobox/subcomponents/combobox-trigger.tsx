"use client";

import { ChevronDownIcon } from "@uiid/icons/chevron-down";

import { InputGroupTrigger } from "../../shared/input-group";
import type { ComboboxTriggerProps } from "../combobox.types";

export const ComboboxTrigger = ({
  children,
  ...props
}: ComboboxTriggerProps) => {
  return (
    <InputGroupTrigger
      slot="combobox-trigger"
      aria-label="Toggle dropdown"
      {...props}
    >
      {children ?? <ChevronDownIcon size={14} />}
    </InputGroupTrigger>
  );
};
ComboboxTrigger.displayName = "ComboboxTrigger";
