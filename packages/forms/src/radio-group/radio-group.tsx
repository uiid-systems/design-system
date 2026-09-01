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
  color,
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
        required={required}
        {...props}
      >
        {!items
          ? children
          : items.map(({ value, label, disabled: itemDisabled }) => (
              /*
               * `RadioProps` sits between the group's dressing and the item's
               * own identity, exactly as `CheckboxProps` does in CheckboxGroup.
               * Spread above them it could not override anything — a group-level
               * `color` of `undefined` still won, so `RadioProps={{ color }}`
               * was silently dropped — and spread below them it would let a
               * shared override clobber each item's `value` and `label`.
               */
              <Radio
                key={value}
                hideIndicator={hideIndicators}
                bordered={bordered}
                reversed={reversed}
                color={color}
                IndicatorProps={IndicatorProps}
                {...RadioProps}
                value={value}
                label={label}
                disabled={itemDisabled || disabled}
              />
            ))}
      </RadioGroupRoot>
    </Field>
  );
};
RadioGroup.displayName = "RadioGroup";
