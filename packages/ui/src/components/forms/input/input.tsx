import { FormField, FormFieldSlots } from "../formfield";
import type { InputProps } from "./input.types";

import "../styles.css";

export const Input = ({
  size = "md",
  validate = false,
  name,
  label,
  description,
  before,
  after,
  // invalid,
  disabled,
  placeholder,
  ...props
}: InputProps) => {
  const hasBookend = Boolean(before || after);
  const propsWithId = { uiid: "input", ...props };

  return (
    <FormField
      data-validate={validate ? true : undefined}
      name={name}
      label={label}
      description={description}
      required={props.required}
    >
      <FormFieldSlots data-disabled={disabled} before={before} after={after}>
        <input
          {...propsWithId}
          data-size={size}
          data-validate={validate ? true : undefined}
          data-slotted={hasBookend ? true : undefined}
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
