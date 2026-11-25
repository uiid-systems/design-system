"use client";

import { definedProps } from "@uiid/utils";

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
  action,
  name,
  defaultValue,
  orientation = "vertical",
  w,
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
     * `w` lands on the field as well as the group. A labelled field is
     * an `inline-flex` Stack that shrink-wraps its content, so a stretched group
     * inside it would only ever fill the width of its own label.
     */
    <Field
      {...FieldProps}
      {...definedProps({
        name,
        label: fieldLabel,
        description,
        action,
        required,
        disabled,
        w,
        size,
      })}
    >
      <CheckboxGroupRoot
        orientation={orientation}
        w={w}
        disabled={disabled}
        defaultValue={defaultValue ? [...defaultValue] : undefined}
        {...props}
      >
        {!items
          ? children
          : items.map(
              ({ value, label: checkboxLabel, disabled: itemDisabled }) => (
                /*
                 * `CheckboxProps` spreads first and the group's dressing
                 * after, so a group value wins and an unset one leaves the
                 * slot's alone. Each item's own identity comes last.
                 */
                <Checkbox
                  key={value}
                  {...CheckboxProps}
                  {...definedProps({
                    name,
                    hideIndicator: hideIndicators,
                    size,
                    bordered,
                    reversed,
                    color,
                    IndicatorProps,
                  })}
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
