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
  reversed,
  bordered,
  indeterminate,
  hideIndicator,
  ContainerProps,
  IndicatorProps,
  ...props
}: CheckboxProps) => {
  return (
    <CheckboxField
      name={name}
      label={label}
      description={description}
      reversed={reversed}
      bordered={bordered}
      {...ContainerProps}
    >
      <CheckboxRoot name={name} hideIndicator={hideIndicator} {...props}>
        <CheckboxIndicator indeterminate={indeterminate} {...IndicatorProps} />
      </CheckboxRoot>
    </CheckboxField>
  );
};
Checkbox.displayName = "Checkbox";
