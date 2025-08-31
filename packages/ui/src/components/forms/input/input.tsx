import { ConditionalRender, Slots } from "../../../components/layout";
import { FormFieldBookend, FormField } from "../subcomponents";
import type { InputProps } from "./input.types";

import "@uiid/tokens/forms/inputs.css";
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
  const hasLabel = Boolean(label || description);
  const propsWithId = { uiid: "input", ...props };

  return (
    <ConditionalRender
      condition={hasLabel}
      wrapper={
        <FormField
          data-validate={validate ? true : undefined}
          name={name}
          label={label}
          description={description}
          required={props.required}
        />
      }
    >
      <Slots
        data-slot="formfield-slots"
        data-size={size}
        data-disabled={disabled}
        before={before && <FormFieldBookend>{before}</FormFieldBookend>}
        after={after && <FormFieldBookend>{after}</FormFieldBookend>}
      >
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
      </Slots>
    </ConditionalRender>
  );
};
Input.displayName = "Input";
