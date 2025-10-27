"use client";

import { useRef, useState } from "react";

import { X } from "@uiid/icons";

import { FormField, FormFieldSlots } from "../formfield";
import "../styles.css";

import type { InputProps } from "./input.types";

export const Input = ({
  size = "md",
  validate = false,
  name,
  label,
  description,
  hint,
  before,
  after,
  beforeOnClick,
  afterOnClick,
  disabled,
  placeholder,
  fullwidth,
  errorMessage,
  hasError,
  onChange,
  enableClear = false,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(false);

  const hasBookend = Boolean(before || after || enableClear);
  const isWrapped = Boolean(label || description || hint || enableClear);
  const hasClear = Boolean(enableClear && hasValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (onChange) {
      onChange(e);
    }
  };

  const handleClearInput = () => {
    const input = inputRef.current;
    if (input) {
      input.value = "";
      setHasValue(false);

      const event = new Event("input", { bubbles: true });
      Object.defineProperty(event, "target", {
        writable: false,
        value: input,
      });

      onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const propsWithId = { uiid: "input", ...props };

  return (
    <FormField
      data-validate={validate ? true : undefined}
      name={name}
      label={label}
      description={hasError ? errorMessage : description}
      hint={hint}
      hasError={hasError}
      fullwidth={fullwidth}
      required={props.required}
    >
      <FormFieldSlots
        data-disabled={disabled}
        before={before}
        beforeOnClick={beforeOnClick}
        after={
          (enableClear ? (
            <X size={12} style={{ display: hasClear ? "block" : "none" }} />
          ) : undefined) || after
        }
        afterOnClick={afterOnClick || (hasClear ? handleClearInput : undefined)}
      >
        <input
          ref={inputRef}
          {...propsWithId}
          data-size={size}
          data-validate={validate ? true : undefined}
          data-slotted={hasBookend ? true : undefined}
          data-wrapped={isWrapped ? true : undefined}
          data-fullwidth={fullwidth && !isWrapped ? true : undefined}
          data-invalid={hasError ? true : undefined}
          name={name}
          id={name}
          tabIndex={disabled ? -1 : undefined}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleInputChange}
        />
      </FormFieldSlots>
    </FormField>
  );
};
Input.displayName = "Input";
