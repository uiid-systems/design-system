"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { MinusIcon } from "@uiid/icons";
import { cx } from "@uiid/utils";

import type { NumberFieldDecrementProps } from "../number-field.types";
import styles from "../number-field.module.css";

export const NumberFieldDecrement = ({
  className,
  ...props
}: NumberFieldDecrementProps) => {
  return (
    <BaseNumberField.Decrement
      data-slot="number-field-decrement"
      className={cx(styles["number-field-decrement"], className)}
      {...props}
    >
      <MinusIcon />
    </BaseNumberField.Decrement>
  );
};
NumberFieldDecrement.displayName = "NumberFieldDecrement";
