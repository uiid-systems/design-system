"use client";

import { definedProps } from "@uiid/utils";

import { Field } from "../field/field";
import type { InputProps } from "./input.types";
import { hasInputSlots } from "./input.utils";
import { InputControl, InputWrapper } from "./subcomponents";

export const Input = ({
  label,
  description,
  action,
  required,
  name,
  size,
  w,
  variant,
  color,
  disabled,
  before,
  after,
  FieldProps,
  className,
  ref,
  ...props
}: InputProps) => {
  /* With a slot, the wrapper paints the surface and takes the props that shape
     it; the input fills the wrapper. Without one, the wrapper renders as
     `display: contents` and the input paints its own surface.
     `w` sizes the field root and whichever of the two wears the surface. */
  const inner = hasInputSlots({ before, after });

  return (
    <Field
      {...FieldProps}
      {...definedProps({
        name,
        label,
        description,
        action,
        required,
        disabled,
        size,
        w,
      })}
    >
      <InputWrapper
        before={before}
        after={after}
        size={size}
        w={w}
        variant={variant}
        color={color}
        disabled={disabled}
      >
        <InputControl
          name={name}
          required={required}
          disabled={disabled}
          inner={inner}
          size={size}
          w={w}
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
