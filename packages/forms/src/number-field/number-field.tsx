"use client";

import { definedProps } from "@uiid/utils";

import { Field } from "../field/field";
import { NUMBER_FIELD_DEFAULT_SIZE } from "./number-field.constants";
import type { NumberFieldProps } from "./number-field.types";
import {
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from "./subcomponents";

export const NumberField = ({
  label,
  description,
  action,
  placeholder,
  disabled,
  required,
  size = NUMBER_FIELD_DEFAULT_SIZE,
  color,
  RootProps,
  GroupProps,
  DecrementProps,
  IncrementProps,
  FieldProps,
  InputProps,
  ...props
}: NumberFieldProps) => {
  // Top-level props win over the same key in RootProps, as in Slider and
  // Switch. The Field reads name from the merged props.
  const rootProps = { ...RootProps, ...definedProps(props) };

  return (
    <Field
      {...FieldProps}
      {...definedProps({
        name: rootProps.name,
        label,
        description,
        action,
        disabled,
        required,
        size,
      })}
    >
      <NumberFieldRoot {...rootProps}>
        {/*
         * The group and the input spread their slot first and NumberField's
         * own values after, so a top-level value wins and an unset one leaves
         * the slot's alone.
         */}
        <NumberFieldGroup {...GroupProps} {...definedProps({ size, color })}>
          <NumberFieldDecrement disabled={disabled} {...DecrementProps} />

          <NumberFieldInput
            {...InputProps}
            {...definedProps({ size, color, placeholder, required })}
          />

          <NumberFieldIncrement disabled={disabled} {...IncrementProps} />
        </NumberFieldGroup>
      </NumberFieldRoot>
    </Field>
  );
};
NumberField.displayName = "NumberField";
