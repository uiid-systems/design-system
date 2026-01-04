"use client";

import { Input as BaseInput } from "@base-ui/react/input";

import { Field } from "../field/field";

import { cx } from "@uiid/utils";

import type { InputProps } from "./input.types";
import { inputVariants } from "./input.variants";
import styles from "./input.module.css";

export const Input = ({
  name,
  label,
  description,
  required,
  size,
  fullwidth,
  FieldProps,
  className,
  ...props
}: InputProps) => {
  return (
    <Field
      label={label}
      description={description}
      name={name}
      required={required}
      {...FieldProps}
    >
      <BaseInput
        data-slot="input"
        name={name}
        className={cx(
          styles["input"],
          inputVariants({ size, fullwidth }),
          className,
        )}
        data-size={size}
        {...props}
      />
    </Field>
  );
};
Input.displayName = "Input";
