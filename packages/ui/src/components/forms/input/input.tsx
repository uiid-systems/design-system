import { FormField, FormFieldSlots } from "../formfield";
import type { InputProps } from "./input.types";

import "../styles.css";

export const Input = ({
  size = "md",
  validate = false,
  name,
  label,
  description,
  hint,
  before,
  after,
  disabled,
  placeholder,
  fullwidth,
  errorMessage,
  hasError,
  ...props
}: InputProps) => {
  const hasBookend = Boolean(before || after);
  const isWrapped = Boolean(label || description || hint);

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
      <FormFieldSlots data-disabled={disabled} before={before} after={after}>
        <input
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
        />
      </FormFieldSlots>
    </FormField>
  );
};
Input.displayName = "Input";
