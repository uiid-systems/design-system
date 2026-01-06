"use client";

import { Input as BaseInput } from "@base-ui/react/input";

import { ConditionalRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { Field } from "../field/field";

import type { InputProps } from "./input.types";
import { inputVariants } from "./input.variants";
import styles from "./input.module.css";

export const Input = ({
  label,
  description,
  required,
  name,
  size,
  fullwidth,
  ghost,
  FieldProps,
  className,
  ...props
}: InputProps) => {
  return (
    <ConditionalRender
      condition={Boolean(label || description)}
      render={
        <Field
          name={name}
          label={label}
          description={description}
          required={required}
          {...FieldProps}
        />
      }
    >
      <BaseInput
        data-slot="input"
        name={name}
        className={cx(
          styles["input"],
          inputVariants({ size, fullwidth, ghost }),
          className,
        )}
        {...props}
      />
    </ConditionalRender>
  );
};
Input.displayName = "Input";
