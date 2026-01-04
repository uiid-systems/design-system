import { FieldLabel } from "@uiid/forms";

import type { SwitchLabelProps } from "../switch.types";

export const SwitchLabel = ({ disabled, name, label }: SwitchLabelProps) => (
  <FieldLabel
    data-slot="switch-label"
    data-disabled={disabled}
    htmlFor={name}
    size={0}
    weight="normal"
  >
    {label}
  </FieldLabel>
);
SwitchLabel.displayName = "SwitchLabel";
