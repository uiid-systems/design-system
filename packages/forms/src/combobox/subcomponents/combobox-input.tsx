"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cx } from "@uiid/utils";

import { Field } from "../../field/field";
import { inputControlClassName } from "../../input/input.styles";
import { InputWrapper } from "../../input/subcomponents";
import { inputGroupInputClassName } from "../../shared/input-group";
import type { ComboboxInputProps } from "../combobox.types";

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
        {/*
         * `name` stops at the Field, which needs it to match a `Form` error.
         * The root already registers this input as the field's control and
         * submits the selected value, so rendering a plain `<input>` rather
         * than `InputControl` keeps it from being named and submitted twice.
         */}
        <BaseCombobox.Input
          data-slot="combobox-input"
          render={<input />}
          className={inputControlClassName({
            inner: hasSlots,
            fullwidth: true,
            className: cx(inputGroupInputClassName, className),
          })}
          placeholder={placeholder}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
ComboboxInput.displayName = "ComboboxInput";
