"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { cx } from "@uiid/utils";

import { InputControl } from "../../input/subcomponents";
import type { NumberFieldInputProps } from "../number-field.types";

import styles from "../number-field.module.css";

export const NumberFieldInput = ({
  size,
  className,
  ...props
}: NumberFieldInputProps) => {
  return (
    <BaseNumberField.Input
      data-slot="number-field-input"
      render={<InputControl size={size} />}
      className={cx(styles["number-field-input"], className)}
      {...props}
    />
  );
};
NumberFieldInput.displayName = "NumberFieldInput";
