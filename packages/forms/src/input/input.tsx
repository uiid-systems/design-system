"use client";

import { Field } from "../field/field";
import type { InputProps } from "./input.types";
import { InputControl, InputWrapper } from "./subcomponents";

export const Input = ({
  label,
  description,
  action,
  required,
  name,
  size,
  fullwidth,
  variant,
  color,
  before,
  after,
  FieldProps,
  className,
  ref,
  ...props
}: InputProps) => {
  const hasSlots = Boolean(before || after);

  return (
    <Field
      name={name}
      label={label}
      description={description}
      action={action}
      required={required}
      size={size}
      {...FieldProps}
    >
      <InputWrapper
        before={before}
        after={after}
        size={size}
        fullwidth={fullwidth}
        variant={variant}
        color={color}
      >
        <InputControl
          name={name}
          required={required}
          inner={hasSlots}
          size={size}
          fullwidth={fullwidth}
          variant={variant}
          color={color}
          className={className}
          ref={ref}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
Input.displayName = "Input";
