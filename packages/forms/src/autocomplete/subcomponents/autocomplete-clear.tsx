"use client";

import { XIcon } from "@uiid/icons/x";

import { InputGroupClear } from "../../shared/input-group";
import type { AutocompleteClearProps } from "../autocomplete.types";

export const AutocompleteClear = ({
  children,
  ...props
}: AutocompleteClearProps) => {
  return (
    <InputGroupClear
      slot="autocomplete-clear"
      aria-label="Clear selection"
      {...props}
    >
      {children ?? <XIcon size={14} />}
    </InputGroupClear>
  );
};
AutocompleteClear.displayName = "AutocompleteClear";
