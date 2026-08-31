"use client";

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
  name,
  placeholder,
  disabled,
  required,
  size = NUMBER_FIELD_DEFAULT_SIZE,
  RootProps,
  GroupProps,
  DecrementProps,
  IncrementProps,
  FieldProps,
  InputProps,
  ...props
}: NumberFieldProps) => {
  return (
    <Field
      name={name}
      label={label}
      description={description}
      disabled={disabled}
      required={required}
      {...FieldProps}
    >
      <NumberFieldRoot name={name} {...RootProps} {...props}>
        <NumberFieldGroup size={size} {...GroupProps}>
          <NumberFieldDecrement disabled={disabled} {...DecrementProps} />

          <NumberFieldInput
            size={size}
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
