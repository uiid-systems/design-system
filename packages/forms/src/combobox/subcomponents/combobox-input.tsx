"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { Field } from "../../field/field";
import { inputControlClassName } from "../../input/input.styles";
import { InputWrapper } from "../../input/subcomponents";
import type { ComboboxInputProps } from "../combobox.types";

export const ComboboxInput = ({
  label,
  description,
  name,
  placeholder,
  before,
  after,
  size,
  color,
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
      {/*
       * The hue goes to both the wrapper and the control because either can be
       * the element wearing the surface. Combobox's monolith always renders an
       * `after`, so the wrapper carries it there; a bare `ComboboxInput` with no
       * slots has no wrapper at all and the `<input>` carries it instead.
       */}
      <InputWrapper
        before={before}
        after={after}
        size={size}
        color={color}
        fullwidth
      >
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
            size,
            fullwidth: true,
            color,
            className,
          })}
          placeholder={placeholder}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
ComboboxInput.displayName = "ComboboxInput";
