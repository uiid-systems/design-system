"use client";

import { InputGroupIcon } from "../../shared/input-group";
import type { ComboboxIconProps } from "../combobox.types";

export const ComboboxIcon = (props: ComboboxIconProps) => {
  return <InputGroupIcon slot="combobox-icon" {...props} />;
};
ComboboxIcon.displayName = "ComboboxIcon";
