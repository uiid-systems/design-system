"use client";

import { Field } from "../field/field";
import { Radio } from "../radio/radio";
import type { RadioGroupProps } from "./radio-group.types";
import { RadioGroupRoot } from "./subcomponents";

export const RadioGroup = ({
  items,
  label,
  description,
  action,
  name,
  orientation = "vertical",
  fullwidth,
  size,
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
    /*
     * `fullwidth` lands on the field as well as the group. A labelled field is
     * an `inline-flex` Stack that shrink-wraps its content, so a stretched group
     * inside it would only ever fill the width of its own label.
     */
    <Field
      name={name}
      label={label}
      description={description}
      action={action}
      required={required}
      disabled={disabled}
      fullwidth={fullwidth}
      {...FieldProps}
    >
      <RadioGroupRoot
        name={name}
        orientation={orientation}
        fullwidth={fullwidth}
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
                size={size}
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
