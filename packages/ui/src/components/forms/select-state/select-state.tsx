import { states } from "../../../data/states";
import { Select } from "../select/select";

import type { SelectStateProps } from "./select-state.types";

export const SelectState = ({
  type = "fullname",
  ...props
}: SelectStateProps) => {
  const options = Object.entries(states).map(([label, value]) => ({
    label: type === "postal" ? value : label,
    value: type === "postal" ? label : value,
  }));

  return <Select options={options} placeholder="Select a state" {...props} />;
};
SelectState.displayName = "SelectState";
