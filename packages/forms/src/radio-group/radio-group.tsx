"use client";

import { definedProps } from "@uiid/utils";

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
      {...FieldProps}
      {...definedProps({
        name,
        label,
        description,
        action,
        required,
        disabled,
        fullwidth,
        size,
      })}
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
               * `RadioProps` spreads first and the group's dressing after, as
               * `CheckboxProps` does in CheckboxGroup, so a group value wins.
               * `definedProps` leaves an unset one out: spread as `undefined`,
               * a group-level `color` once erased the slot's. Each item's own
               * identity comes last, so a shared override cannot clobber it.
               */
              <Radio
                key={value}
                {...RadioProps}
                {...definedProps({
                  hideIndicator: hideIndicators,
                  size,
                  bordered,
                  reversed,
                  color,
                  IndicatorProps,
                })}
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
