"use client";

import { paletteClassName } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import { Field } from "../field/field";
import { FieldControl } from "../field/subcomponents";
import { InputWrapper } from "../input/subcomponents";
import { TEXTAREA_DEFAULT_ROWS } from "./textarea.constants";
import type { TextareaProps } from "./textarea.types";
import { textareaVariants } from "./textarea.variants";

import styles from "./textarea.module.css";

export const Textarea = ({
  label,
  description,
  action,
  required,
  name,
  size,
  resize,
  fullwidth,
  variant,
  color,
  rows = TEXTAREA_DEFAULT_ROWS,
  before,
  after,
  id,
  value,
  defaultValue,
  autoFocus,
  disabled,
  onValueChange,
  FieldProps,
  className,
  ref,
  ...props
}: TextareaProps) => {
  /* With a slot, the wrapper paints the surface and takes the props that shape
     it. The textarea keeps its tier for font-size and padding, and its resize. */
  const hasSlots = Boolean(before || after);

  return (
    <Field
      name={name}
      label={label}
      description={description}
      action={action}
      required={required}
      disabled={disabled}
      size={size}
      w={fullwidth ? "full" : undefined}
      {...FieldProps}
    >
      <InputWrapper
        orientation="vertical"
        before={before}
        after={after}
        size={size}
        fullwidth={fullwidth}
        variant={variant}
        color={color}
        disabled={disabled}
      >
        {/*
          `id`, `value`, `defaultValue`, `autoFocus` and `disabled` must reach
          FieldControl itself, not the render element: it reads them to wire the
          label, track filled and focused state, and register the value for
          validation. Anything left in `props` is DOM-only and rides the render
          `<textarea>`.
        */}
        <FieldControl
          data-slot="textarea"
          id={id}
          name={name}
          value={value}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          disabled={disabled}
          required={required}
          onValueChange={onValueChange}
          className={cx(
            styles["textarea"],
            hasSlots
              ? cx(styles["textarea-inner"], textareaVariants({ size, resize }))
              : cx(
                  textareaVariants({ size, resize, fullwidth, variant }),
                  paletteClassName(color, styles["color"]),
                ),
            className,
          )}
          render={<textarea ref={ref} rows={rows} {...props} />}
        />
      </InputWrapper>
    </Field>
  );
};
Textarea.displayName = "Textarea";
