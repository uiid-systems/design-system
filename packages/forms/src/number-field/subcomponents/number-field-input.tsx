"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { cx } from "@uiid/utils";

import { inputControlClassName } from "../../input/input.styles";
import type { NumberFieldInputProps } from "../number-field.types";

import styles from "../number-field.module.css";

export const NumberFieldInput = ({
  size,
  className,
  ...props
}: NumberFieldInputProps) => {
  return (
    /*
     * The root already registers this input as the field's control and submits
     * the value through a hidden input of its own, so this renders a plain
     * `<input>` rather than `InputControl` — a `Field.Control` here would take
     * the field's name and submit the value a second time.
     */
    <BaseNumberField.Input
      data-slot="number-field-input"
      render={<input />}
      className={inputControlClassName({
        size,
        className: cx(styles["number-field-input"], className),
      })}
      {...props}
    />
  );
};
NumberFieldInput.displayName = "NumberFieldInput";
