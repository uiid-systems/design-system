"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cx, definedProps } from "@uiid/utils";

import { Field } from "../../field/field";
import { inputControlClassName } from "../../input/input.styles";
import { hasInputSlots } from "../../input/input.utils";
import { InputWrapper } from "../../input/subcomponents";
import type { ComboboxInputProps } from "../combobox.types";
import { ComboboxInputGroup } from "./combobox-input-group";

export const ComboboxInput = ({
  label,
  description,
  action,
  name,
  placeholder,
  before,
  after,
  size,
  variant,
  fullwidth = true,
  color,
  disabled,
  required,
  FieldProps,
  InputGroupProps,
  className,
  ...props
}: ComboboxInputProps) => {
  const hasSlots = hasInputSlots({ before, after });

  return (
    /*
     * `FieldProps` spreads first and the part's own values after, so they win
     * and an unset one leaves the slot's alone: Combobox sends `required`
     * through `FieldProps` and leaves the part's own unset. `fullwidth` is a
     * default the slot may still change, as `w` is on Input.
     */
    <Field
      fullwidth={fullwidth}
      {...FieldProps}
      {...definedProps({
        name,
        label,
        description,
        action,
        disabled,
        required,
        size,
      })}
    >
      {/*
       * Base UI anchors the popup to the input group, so the group wraps the
       * control row alone and the popup opens against the control. The
       * label, description and error stay outside it, which also keeps them
       * out of the group's press handler and its `role="group"`.
       */}
      <ComboboxInputGroup
        size={size}
        fullwidth={fullwidth}
        {...InputGroupProps}
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
          variant={variant}
          fullwidth={fullwidth}
          color={color}
          disabled={disabled}
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
            className={cx(
              inputControlClassName({
                inner: hasSlots,
                size,
                fullwidth,
                variant,
                color,
              }),
              className,
            )}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            {...props}
          />
        </InputWrapper>
      </ComboboxInputGroup>
    </Field>
  );
};
ComboboxInput.displayName = "ComboboxInput";
