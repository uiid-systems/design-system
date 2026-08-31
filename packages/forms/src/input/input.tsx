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
  ghost,
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
        ghost={ghost}
      >
        <InputControl
          name={name}
          inner={hasSlots}
          size={size}
          fullwidth={fullwidth}
          ghost={ghost}
          className={className}
          ref={ref}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
Input.displayName = "Input";
