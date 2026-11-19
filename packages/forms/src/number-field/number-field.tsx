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
      name={rootProps.name}
      label={label}
      description={description}
      action={action}
      disabled={disabled}
      required={required}
      size={size}
      {...FieldProps}
    >
      <NumberFieldRoot {...rootProps}>
        <NumberFieldGroup size={size} color={color} {...GroupProps}>
          <NumberFieldDecrement disabled={disabled} {...DecrementProps} />

          <NumberFieldInput
            size={size}
            color={color}
            placeholder={placeholder}
            required={required}
            {...InputProps}
          />

          <NumberFieldIncrement disabled={disabled} {...IncrementProps} />
        </NumberFieldGroup>
      </NumberFieldRoot>
    </Field>
  );
};
NumberField.displayName = "NumberField";
