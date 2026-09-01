"use client";

import type { CheckboxProps } from "./checkbox.types";
import {
  CheckboxRoot,
  CheckboxField,
  CheckboxIndicator,
} from "./subcomponents";

export const Checkbox = ({
  name,
  label,
  description,
  size,
  color,
  reversed,
  bordered,
  indeterminate,
  hideIndicator,
  FieldProps,
  IndicatorProps,
  ...props
}: CheckboxProps) => {
  return (
    <CheckboxField
      label={label}
      description={description}
      size={size}
      reversed={reversed}
      bordered={bordered}
      {...FieldProps}
    >
      <CheckboxRoot
        name={name}
        size={size}
        color={color}
        hideIndicator={hideIndicator}
        indeterminate={indeterminate}
        {...props}
      >
        <CheckboxIndicator indeterminate={indeterminate} {...IndicatorProps} />
      </CheckboxRoot>
    </CheckboxField>
  );
};
Checkbox.displayName = "Checkbox";
