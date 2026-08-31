"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cx } from "@uiid/utils";

import { Field } from "../../field/field";
import { InputControl, InputWrapper } from "../../input/subcomponents";
import type { ComboboxInputProps } from "../combobox.types";

import styles from "../combobox.module.css";

export const ComboboxInput = ({
  label,
  description,
  name,
  placeholder,
  before,
  after,
  FieldProps,
  className,
  ...props
}: ComboboxInputProps) => {
  const hasSlots = Boolean(before || after);

  return (
    <Field
      name={name}
      label={label}
      description={description}
      fullwidth
      {...FieldProps}
    >
      <InputWrapper before={before} after={after} fullwidth>
        <BaseCombobox.Input
          data-slot="combobox-input"
          name={name}
          render={<InputControl inner={hasSlots} fullwidth />}
          className={cx(styles["combobox-input"], className)}
          placeholder={placeholder}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
ComboboxInput.displayName = "ComboboxInput";
