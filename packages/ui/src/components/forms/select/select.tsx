import { ConditionalRender, Slots } from "../../layout";

import type { SelectProps } from "../types";
import { Bookend, FormField } from "../subcomponents";

export const Select = ({
  size = "md",
  validate = false,
  name,
  label,
  description,
  before,
  after,
  // invalid,
  disabled,
  options,
  placeholder,
  ...props
}: SelectProps) => {
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
        data-uiid="formfield-slots"
        data-disabled={disabled}
        before={before && <Bookend>{before}</Bookend>}
        after={after && <Bookend>{after}</Bookend>}
      >
        <select
          {...props}
          data-uiid="select"
          data-size={size}
          data-validate={validate ? true : undefined}
          data-slotted={true}
          name={name}
          id={name}
          /** @todo enable focus when disabled */
          tabIndex={disabled ? -1 : undefined}
          disabled={disabled}
          defaultValue={placeholder ? "" : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(({ value, label, disabled }) => (
            <option key={value} value={value} disabled={disabled}>
              {label}
            </option>
          ))}
        </select>
      </Slots>
    </ConditionalRender>
  );
};
Select.displayName = "Select";
