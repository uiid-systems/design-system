"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { cx } from "@uiid/utils";

import { Field } from "../../field/field";
import { inputControlClassName } from "../../input/input.styles";
import { hasInputSlots } from "../../input/input.utils";
import { InputWrapper } from "../../input/subcomponents";
import type { AutocompleteInputProps } from "../autocomplete.types";
import { AutocompleteInputGroup } from "./autocomplete-input-group";

export const AutocompleteInput = ({
  label,
  description,
  action,
  name,
  onFocus,
  onBlur,
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
}: AutocompleteInputProps) => {
  const hasSlots = hasInputSlots({ before, after });

  return (
    <Field
      name={name}
      label={label}
      description={description}
      action={action}
      disabled={disabled}
      required={required}
      fullwidth={fullwidth}
      size={size}
      {...FieldProps}
    >
      {/*
       * Base UI anchors the popup to the input group, so the group wraps the
       * control row alone and the popup opens against the control. The
       * label, description and error stay outside it, which also keeps them
       * out of the group's press handler and its `role="group"`.
       */}
      <AutocompleteInputGroup
        size={size}
        fullwidth={fullwidth}
        {...InputGroupProps}
      >
        {/*
         * The hue goes to whichever element wears the surface. Autocomplete
         * renders no slots by default, so the wrapper is usually a box-less
         * `display: contents` and the `<input>` carries it; pass `before` or
         * `after` and the wrapper paints the surface and carries it instead.
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
           * The root already registers this input as the field's control, so
           * rendering a plain `<input>` rather than `InputControl` leaves Base UI
           * to decide whether the input carries the name for submission.
           */}
          <BaseAutocomplete.Input
            data-slot="autocomplete-input"
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
            onFocus={onFocus}
            onBlur={onBlur}
            {...props}
          />
        </InputWrapper>
      </AutocompleteInputGroup>
    </Field>
  );
};
AutocompleteInput.displayName = "AutocompleteInput";
