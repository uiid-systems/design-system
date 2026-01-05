"use client";

import { Input as BaseInput } from "@base-ui/react/input";

import { Field } from "../field/field";

import { cx } from "@uiid/utils";

import type { InputProps } from "./input.types";
import { inputVariants } from "./input.variants";
import styles from "./input.module.css";

export const Input = ({
  label,
  description,
  required,
  size,
  fullwidth,
  ghost,
  FieldProps,
  className,
  ...props
}: InputProps) => {
  return (
    <Field
      label={label}
      description={description}
      required={required}
      {...FieldProps}
    >
      <BaseInput
        data-slot="input"
        className={cx(
          styles["input"],
          inputVariants({ size, fullwidth, ghost }),
          className,
        )}
        {...props}
      />
    </Field>
  );
};
Input.displayName = "Input";
