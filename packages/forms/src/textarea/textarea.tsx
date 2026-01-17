"use client";

import { Field as BaseField } from "@base-ui/react/field";

import { cx } from "@uiid/utils";

import { Field } from "../field/field";

import type { TextareaProps } from "./textarea.types";
import { textareaVariants } from "./textarea.variants";
import { TEXTAREA_DEFAULT_ROWS } from "./textarea.constants";
import styles from "./textarea.module.css";

export const Textarea = ({
  label,
  description,
  required,
  name,
  size,
  resize,
  fullwidth,
  ghost,
  rows = TEXTAREA_DEFAULT_ROWS,
  FieldProps,
  className,
  ref,
  ...props
}: TextareaProps) => {
  const textareaClassName = cx(
    styles["textarea"],
    textareaVariants({ size, resize, fullwidth, ghost }),
    className,
  );

  // When wrapped in Field, use Field.Control for proper label association
  if (label || description) {
    return (
      <Field
        name={name}
        label={label}
        description={description}
        required={required}
        {...FieldProps}
      >
        <BaseField.Control
          data-slot="textarea"
          name={name}
          required={required}
          className={textareaClassName}
          render={<textarea ref={ref} rows={rows} {...props} />}
        />
      </Field>
    );
  }

  return (
    <textarea
      data-slot="textarea"
      ref={ref}
      name={name}
      rows={rows}
      required={required}
      className={textareaClassName}
      {...props}
    />
  );
};
Textarea.displayName = "Textarea";
