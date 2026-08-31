"use client";

import { SwitchRoot, SwitchThumb, SwitchField } from "./subcomponents";
import type { SwitchProps } from "./switch.types";

export const Switch = ({
  label,
  description,
  name,
  disabled,
  size,
  bordered,
  reversed,
  RootProps,
  ThumbProps,
  FieldProps,
  ...props
}: SwitchProps) => {
  return (
    <SwitchField
      label={label}
      description={description}
      size={size}
      reversed={reversed}
      bordered={bordered}
      {...FieldProps}
    >
      <SwitchRoot
        id={name}
        name={name}
        size={size}
        disabled={disabled}
        {...props}
        {...RootProps}
      >
        <SwitchThumb {...ThumbProps} />
      </SwitchRoot>
    </SwitchField>
  );
};
Switch.displayName = "Switch";
