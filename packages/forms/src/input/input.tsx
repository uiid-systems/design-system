"use client";

import { Input as BaseInput } from "@base-ui-components/react/input";

import { Field } from "../field/field";

import { cx } from "@uiid/utils";

import { INPUT_DEFAULT_SIZE } from "./input.constants";
import type { InputProps } from "./input.types";
import styles from "./input.module.css";

export const Input = ({
  size = INPUT_DEFAULT_SIZE,
  label,
  description,
  error,
  className,
  ...props
}: InputProps) => {
  return (
    <Field label={label} description={description} error={error}>
      <BaseInput
        data-slot="input"
        className={cx(styles["input"], className)}
        data-size={size}
        {...props}
      />
    </Field>
  );
};
Input.displayName = "Input";
