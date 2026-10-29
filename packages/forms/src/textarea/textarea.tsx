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
      size={size}
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
      >
        <FieldControl
          data-slot="textarea"
          name={name}
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
