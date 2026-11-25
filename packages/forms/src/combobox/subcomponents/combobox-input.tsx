"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cx, definedProps, prepareComponentProps } from "@uiid/utils";

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
  w = "full",
  color,
  disabled,
  required,
  FieldProps,
  InputGroupProps,
  className,
  ...props
}: ComboboxInputProps) => {
  const hasSlots = hasInputSlots({ before, after });

  /*
   * Combobox sends its resolved `required` through `FieldProps`, outside the
   * slot's type. The part's own `required` is also the text input's native
   * attribute, which the monolith's `InputProps` can still set. Either one
   * marks the field, so the label never hides a requirement the input enforces.
   */
  const fieldRequired =
    Boolean((FieldProps as { required?: boolean } | undefined)?.required) ||
    required;

  return (
    /*
     * `FieldProps` spreads first and the part's own values after, so they win
     * and an unset one leaves the slot's alone; `required` is resolved above.
     */
    <Field
      {...FieldProps}
      {...definedProps({
        name,
        label,
        description,
        action,
        disabled,
        required: fieldRequired,
        size,
        w,
      })}
    >
      {/*
       * Base UI anchors the popup to the input group, so the group wraps the
       * control row alone and the popup opens against the control. The
       * label, description and error stay outside it, which also keeps them
       * out of the group's press handler and its `role="group"`.
       */}
      <ComboboxInputGroup {...InputGroupProps} {...definedProps({ size, w })}>
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
          w={w}
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
            render={<input />}
            className={cx(
              inputControlClassName({
                inner: hasSlots,
                size,
                variant,
                color,
              }),
              className,
            )}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            {...prepareComponentProps({
              componentName: "combobox-input",
              styleProps: ["w"],
              // With a slot the wrapper takes the width and the input fills it.
              props: { ...props, w: hasSlots ? undefined : w },
            })}
          />
        </InputWrapper>
      </ComboboxInputGroup>
    </Field>
  );
};
ComboboxInput.displayName = "ComboboxInput";
