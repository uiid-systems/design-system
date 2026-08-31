"use client";

import { InputGroupRoot } from "../../shared/input-group";
import type { ComboboxInputGroupProps } from "../combobox.types";

export const ComboboxInputGroup = (props: ComboboxInputGroupProps) => {
  return <InputGroupRoot slot="combobox-input-group" {...props} />;
};
ComboboxInputGroup.displayName = "ComboboxInputGroup";
