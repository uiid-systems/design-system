"use client";

import { cx } from "@uiid/utils";

import { Field } from "../field/field";
import { FieldControl } from "../field/subcomponents";
import { TEXTAREA_DEFAULT_ROWS } from "./textarea.constants";
import type { TextareaProps } from "./textarea.types";
import { textareaVariants } from "./textarea.variants";

import styles from "./textarea.module.css";

export const Textarea = ({
  label,
  description,
  required,
  name,
  size,
  resize,
  fullwidth,
  variant,
  rows = TEXTAREA_DEFAULT_ROWS,
  onValueChange,
  FieldProps,
  className,
  ref,
  ...props
}: TextareaProps) => {
  return (
    <Field
      name={name}
      label={label}
      description={description}
      required={required}
      {...FieldProps}
    >
      <FieldControl
        data-slot="textarea"
        name={name}
        required={required}
        onValueChange={onValueChange}
        className={cx(
          styles["textarea"],
          textareaVariants({ size, resize, fullwidth, variant }),
          className,
        )}
        render={<textarea ref={ref} rows={rows} {...props} />}
      />
    </Field>
  );
};
Textarea.displayName = "Textarea";
