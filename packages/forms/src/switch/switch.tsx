"use client";

import { SwitchRoot, SwitchThumb, SwitchField } from "./subcomponents";
import type { SwitchProps } from "./switch.types";

export const Switch = ({
  label,
  description,
  bordered,
  reversed,
  RootProps,
  ThumbProps,
  FieldProps,
  ...props
}: SwitchProps) => {
  // Top-level props win over the same key in RootProps, as in Slider and
  // NumberField. The field row reads size from the merged props.
  const rootProps = { ...RootProps, ...props };

  return (
    <SwitchField
      label={label}
      description={description}
      size={rootProps.size}
      reversed={reversed}
      bordered={bordered}
      {...FieldProps}
    >
      <SwitchRoot {...rootProps}>
        <SwitchThumb {...ThumbProps} />
      </SwitchRoot>
    </SwitchField>
  );
};
Switch.displayName = "Switch";
