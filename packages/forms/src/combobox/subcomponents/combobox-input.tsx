"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cxState } from "@uiid/utils";

import { Field } from "../../field/field";
import { inputControlClassName } from "../../input/input.styles";
import { hasInputSlots } from "../../input/input.utils";
import { InputWrapper } from "../../input/subcomponents";
import type { ComboboxInputProps } from "../combobox.types";

export const ComboboxInput = ({
  label,
  description,
  action,
  name,
  placeholder,
  before,
  after,
  size,
  color,
  disabled,
  FieldProps,
  className,
  ...props
}: ComboboxInputProps) => {
  const hasSlots = hasInputSlots({ before, after });

  return (
    <Field
      name={name}
      label={label}
      description={description}
      action={action}
      disabled={disabled}
      fullwidth
      size={size}
      {...FieldProps}
    >
      {/*
       * The hue goes to whichever element wears the surface. Combobox's
       * monolith always renders an `after`, so the wrapper carries it there; a
       * bare `ComboboxInput` with no slots leaves the wrapper as a box-less
       * `display: contents` and the `<input>` carries it instead.
       */}
      <InputWrapper
        before={before}
        after={after}
        size={size}
        color={color}
        disabled={disabled}
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
          className={cxState(
            inputControlClassName({
              inner: hasSlots,
              size,
              fullwidth: true,
              color,
            }),
            className,
          )}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      </InputWrapper>
    </Field>
  );
};
ComboboxInput.displayName = "ComboboxInput";
