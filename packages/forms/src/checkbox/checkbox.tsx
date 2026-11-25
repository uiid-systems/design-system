"use client";

import { definedProps } from "@uiid/utils";

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
      {...FieldProps}
      label={label}
      description={description}
      size={size}
      reversed={reversed}
      bordered={bordered}
    >
      <CheckboxRoot
        name={name}
        size={size}
        color={color}
        hideIndicator={hideIndicator}
        indeterminate={indeterminate}
        {...props}
      >
        <CheckboxIndicator
          {...IndicatorProps}
          {...definedProps({ indeterminate })}
        />
      </CheckboxRoot>
    </CheckboxField>
  );
};
Checkbox.displayName = "Checkbox";
