"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { PlusIcon } from "@uiid/icons";
import { cx } from "@uiid/utils";

import type { NumberFieldIncrementProps } from "../number-field.types";
import styles from "../number-field.module.css";

export const NumberFieldIncrement = ({
  className,
  ...props
}: NumberFieldIncrementProps) => {
  return (
    <BaseNumberField.Increment
      data-slot="number-field-increment"
      className={cx(styles["number-field-increment"], className)}
      {...props}
    >
      <PlusIcon />
    </BaseNumberField.Increment>
  );
};
NumberFieldIncrement.displayName = "NumberFieldIncrement";
