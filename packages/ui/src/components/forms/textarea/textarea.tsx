import { FormField, FormFieldSlots } from "../formfield";
import type { TextareaProps } from "./textarea.types";

import "../styles.css";
import styles from "./textarea.module.css";

export const Textarea = ({
  size = "md",
  validate = false,
  name,
  label,
  description,
  hint,
  cols,
  rows = 3,
  before,
  after,
  disabled,
  placeholder,
  fullwidth,
  errorMessage,
  hasError,
  ...props
}: TextareaProps) => {
  const hasBookend = Boolean(before || after);
  const isWrapped = Boolean(label || description || hint);

  const propsWithId = { uiid: "textarea", ...props };

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
      <FormFieldSlots data-disabled={disabled} before={before} after={after}>
        <textarea
          {...propsWithId}
          data-size={size}
          data-validate={validate ? true : undefined}
          data-slotted={hasBookend ? true : undefined}
          data-wrapped={isWrapped ? true : undefined}
          data-fullwidth={fullwidth && !isWrapped ? true : undefined}
          data-invalid={hasError ? true : undefined}
          name={name}
          id={name}
          cols={cols}
          rows={rows}
          tabIndex={disabled ? -1 : undefined}
          disabled={disabled}
          placeholder={placeholder}
          className={styles.textarea}
        />
      </FormFieldSlots>
    </FormField>
  );
};
Textarea.displayName = "Textarea";
