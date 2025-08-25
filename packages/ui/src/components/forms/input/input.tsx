import { ConditionalRender, Slots } from "../../../components/layout";
import { Bookend, FormField } from "../subcomponents";
import type { InputProps } from "../types";

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
        before={before && <Bookend>{before}</Bookend>}
        after={after && <Bookend>{after}</Bookend>}
      >
        <input
          {...props}
          data-uiid="input"
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
