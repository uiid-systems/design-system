"use client";

import { Field } from "../field/field";
import type { InputProps } from "./input.types";
import { InputControl, InputWrapper } from "./subcomponents";

export const Input = ({
  label,
  description,
  required,
  name,
  size,
  fullwidth,
  variant,
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
      required={required}
      {...FieldProps}
    >
      <InputWrapper
        before={before}
        after={after}
        size={size}
        fullwidth={fullwidth}
        variant={variant}
      >
        <InputControl
          name={name}
          required={required}
          inner={hasSlots}
          size={size}
          fullwidth={fullwidth}
          variant={variant}
          className={className}
          ref={ref}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
Input.displayName = "Input";
