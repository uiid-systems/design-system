"use client";

import { Input as BaseInput } from "@base-ui/react/input";

import { Field } from "../field/field";

import { cx } from "@uiid/utils";

import type { InputProps } from "./input.types";
import { inputVariants } from "./input.variants";
import styles from "./input.module.css";

export const Input = ({
  /** data */
  name,
  label,
  description,
  error,
  /** variants */
  size,
  /** misc */
  className,
  ...props
}: InputProps) => {
  return (
    <Field label={label} description={description} error={error} name={name}>
      <BaseInput
        data-slot="input"
        className={cx(styles["input"], inputVariants({ size }), className)}
        data-size={size}
        {...props}
      />
    </Field>
  );
};
Input.displayName = "Input";
