"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Separator } from "@uiid/layout";

import type { SelectSeparatorProps } from "../select.types";

/** Draws the system `Separator` line between groups of rows. */
export const SelectSeparator = (props: SelectSeparatorProps) => {
  return (
    <BaseSelect.Separator
      data-slot="select-separator"
      render={<Separator />}
      {...props}
    />
  );
};
SelectSeparator.displayName = "SelectSeparator";
