"use client";

import { Input as BaseInput } from "@base-ui/react/input";

import { ConditionalRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { Field } from "../field/field";

import { InputWrapper } from "./input-wrapper";
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
  before,
  after,
  FieldProps,
  className,
  ref,
  ...props
}: InputProps) => {
  const hasSlots = Boolean(before || after);

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
      <InputWrapper
        before={before}
        after={after}
        size={size}
        fullwidth={fullwidth}
        ghost={ghost}
      >
        <BaseInput
          data-slot="input"
          ref={ref}
          name={name}
          className={cx(
            styles["input"],
            hasSlots ? styles["input-inner"] : inputVariants({ size, fullwidth, ghost }),
            className,
          )}
          {...props}
        />
      </InputWrapper>
    </ConditionalRender>
  );
};
Input.displayName = "Input";
