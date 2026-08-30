"use client";

import { Field } from "../field/field";
import { Radio } from "../radio/radio";
import type { RadioGroupProps } from "./radio-group.types";
import { RadioGroupRoot } from "./subcomponents";

export const RadioGroup = ({
  items,
  label,
  description,
  name,
  direction = "vertical",
  bordered,
  reversed,
  hideIndicators,
  disabled,
  required,
  RadioProps,
  IndicatorProps,
  FieldProps,
  children,
  ...props
}: RadioGroupProps) => {
  return (
    <Field
      name={name}
      label={label}
      description={description}
      required={required}
      disabled={disabled}
      {...FieldProps}
    >
      <RadioGroupRoot
        name={name}
        direction={direction}
        disabled={disabled}
        {...props}
      >
        {!items
          ? children
          : items.map(({ value, label, disabled: itemDisabled }) => (
              <Radio
                key={value}
                {...RadioProps}
                hideIndicator={hideIndicators}
                bordered={bordered}
                reversed={reversed}
                value={value}
                label={label}
                disabled={itemDisabled || disabled}
                IndicatorProps={IndicatorProps}
              />
            ))}
      </RadioGroupRoot>
    </Field>
  );
};
RadioGroup.displayName = "RadioGroup";
