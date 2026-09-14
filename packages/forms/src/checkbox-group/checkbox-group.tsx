"use client";

import { Checkbox } from "../checkbox/checkbox";
import { Field } from "../field/field";
import type { CheckboxGroupProps } from "./checkbox-group.types";
import { CheckboxGroupRoot } from "./subcomponents";

/**
 * `required` marks the label only. Base UI's `CheckboxGroup` has no `required`
 * prop, and HTML cannot express "at least one of these boxes" — setting
 * `required` on each `Checkbox` would demand that *every* box be checked, which
 * is the opposite of what the marker promises. Validate the group's value
 * instead, via `Field`'s `validate`.
 */
export const CheckboxGroup = ({
  items,
  label: fieldLabel,
  description,
  name,
  defaultValue,
  orientation = "vertical",
  fullwidth,
  hideIndicators,
  size,
  bordered,
  reversed,
  color,
  disabled,
  required,
  CheckboxProps,
  IndicatorProps,
  FieldProps,
  children,
  ...props
}: CheckboxGroupProps) => {
  return (
    /*
     * `fullwidth` lands on the field as well as the group. A labelled field is
     * an `inline-flex` Stack that shrink-wraps its content, so a stretched group
     * inside it would only ever fill the width of its own label.
     */
    <Field
      name={name}
      label={fieldLabel}
      description={description}
      required={required}
      disabled={disabled}
      fullwidth={fullwidth}
      {...FieldProps}
    >
      <CheckboxGroupRoot
        orientation={orientation}
        fullwidth={fullwidth}
        disabled={disabled}
        defaultValue={defaultValue ? [...defaultValue] : undefined}
        {...props}
      >
        {!items
          ? children
          : items.map(
              ({ value, label: checkboxLabel, disabled: itemDisabled }) => (
                <Checkbox
                  key={value}
                  name={name}
                  hideIndicator={hideIndicators}
                  size={size}
                  bordered={bordered}
                  reversed={reversed}
                  color={color}
                  IndicatorProps={IndicatorProps}
                  {...CheckboxProps}
                  value={value}
                  label={checkboxLabel}
                  disabled={itemDisabled || disabled}
                />
              ),
            )}
      </CheckboxGroupRoot>
    </Field>
  );
};
CheckboxGroup.displayName = "CheckboxGroup";
