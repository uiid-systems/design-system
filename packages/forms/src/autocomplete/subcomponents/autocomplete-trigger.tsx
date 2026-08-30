"use client";

import { ChevronDownIcon } from "@uiid/icons/chevron-down";

import { InputGroupTrigger } from "../../shared/input-group";
import type { AutocompleteTriggerProps } from "../autocomplete.types";

export const AutocompleteTrigger = ({
  children,
  ...props
}: AutocompleteTriggerProps) => {
  return (
    <InputGroupTrigger
      slot="autocomplete-trigger"
      aria-label="Toggle dropdown"
      {...props}
    >
      {children ?? <ChevronDownIcon size={14} />}
    </InputGroupTrigger>
  );
};
AutocompleteTrigger.displayName = "AutocompleteTrigger";
