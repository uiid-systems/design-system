"use client";

import { Select } from "../select/select";

import type { SelectStateProps } from "./select-state.types";
import { STATES } from "./select-state.constants";

export const SelectState = ({
  type = "fullname",
  ...props
}: SelectStateProps) => {
  const options = Object.entries(STATES).map(([label, value]) => ({
    label: type === "postal" ? value : label,
    value: type === "postal" ? label : value,
  }));

  return <Select options={options} placeholder="Select a state" {...props} />;
};
SelectState.displayName = "SelectState";
