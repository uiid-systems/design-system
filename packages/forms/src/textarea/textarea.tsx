"use client";

import { paletteClassName } from "@uiid/tokens";
import { cx, definedProps, prepareComponentProps } from "@uiid/utils";

import { Field } from "../field/field";
import { FieldControl } from "../field/subcomponents";
import { hasInputSlots } from "../input/input.utils";
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
  w,
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
     it. The textarea drops its own surface but keeps its tier for font-size and
     padding, and its resize. */
  const hasSlots = hasInputSlots({ before, after });

  /* `w` sizes the field root and whichever element wears the surface: the
     wrapper with a slot, the bare `<textarea>` without one. */
  const textareaProps = prepareComponentProps({
    componentName: "textarea",
    styleProps: ["w"],
    props: { ...props, w: hasSlots ? undefined : w },
  });

  return (
    <Field
      w={w}
      {...FieldProps}
      {...definedProps({
        name,
        label,
        description,
        action,
        required,
        disabled,
        size,
      })}
    >
      <InputWrapper
        orientation="vertical"
        before={before}
        after={after}
        size={size}
        w={w}
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
            hasSlots
              ? cx(styles["textarea-inner"], textareaVariants({ size, resize }))
              : cx(
                  styles["textarea"],
                  textareaVariants({ size, resize, variant }),
                  paletteClassName(color, styles["color"]),
                ),
            className,
          )}
          render={<textarea ref={ref} rows={rows} {...textareaProps} />}
        />
      </InputWrapper>
    </Field>
  );
};
Textarea.displayName = "Textarea";
