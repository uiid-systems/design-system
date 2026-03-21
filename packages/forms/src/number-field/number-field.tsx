"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { ConditionalRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { Field } from "../field/field";
import { Input } from "../input/input";

import {
  NumberFieldRoot,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from "./subcomponents";

import type { NumberFieldProps } from "./number-field.types";
import { NUMBER_FIELD_DEFAULT_SIZE } from "./number-field.constants";
import styles from "./number-field.module.css";

/**
 * @todo apply scrub area
 * @see https://base-ui.com/react/components/number-field#scrub-area
 * */
export const NumberField = ({
  label,
  description,
  name,
  placeholder,
  disabled,
  required,
  size = NUMBER_FIELD_DEFAULT_SIZE,
  RootProps,
  DecrementProps,
  IncrementProps,
  FieldProps,
  InputProps,
  ...props
}: NumberFieldProps) => {
  const sizeClass = size ? styles[`size-${size}`] : undefined;

  return (
    <ConditionalRender
      condition={Boolean(label || description)}
      render={
        <Field
          {...FieldProps}
          name={name}
          label={label}
          description={description}
          disabled={disabled}
          required={required}
        />
      }
    >
      <NumberFieldRoot
        name={name}
        {...RootProps}
        className={cx(sizeClass, RootProps?.className)}
        {...props}
      >
        <NumberFieldDecrement disabled={disabled} {...DecrementProps} />

        <BaseNumberField.Input
          render={<Input size={size} FieldProps={{ style: { flex: 1 } }} />}
          className={cx(styles["number-field-input"], InputProps?.className)}
          placeholder={placeholder}
          required={required}
          {...InputProps}
        />

        <NumberFieldIncrement disabled={disabled} {...IncrementProps} />
      </NumberFieldRoot>
    </ConditionalRender>
  );
};
NumberField.displayName = "NumberField";
