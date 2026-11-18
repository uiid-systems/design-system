"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Text } from "@uiid/typography";

import type { SelectGroupLabelProps } from "../select.types";

/**
 * The same treatment as Combobox's and Autocomplete's group label: no `shade`,
 * so the label inherits the popup `Card`'s `--palette-on-tint` and tracks the
 * hue, with size and weight carrying the hierarchy.
 */
export const SelectGroupLabel = ({
  children,
  ...props
}: SelectGroupLabelProps) => {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-group-label"
      render={<Text size={-1} weight="medium" />}
      {...props}
    >
      {children}
    </BaseSelect.GroupLabel>
  );
};
SelectGroupLabel.displayName = "SelectGroupLabel";
