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
      name={name}
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
