import { FormField, FormFieldSlots } from "../formfield";

import type { SelectProps } from "./select.types";
import { SelectChevron } from "./subcomponents";
import "./select.styles.css";

export const Select = ({
  size = "md",
  validate = false,
  name,
  label,
  description,
  before,
  // invalid,
  disabled,
  options,
  placeholder,
  ...props
}: SelectProps) => {
  const propsWithId = { uiid: "select", ...props };

  const Chevron = () => <SelectChevron open={false} />;

  return (
    <FormField
      data-validate={validate ? true : undefined}
      name={name}
      label={label}
      description={description}
      required={props.required}
    >
      <FormFieldSlots
        data-disabled={disabled}
        before={before}
        after={<Chevron />}
      >
        <select
          {...propsWithId}
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
      </FormFieldSlots>
    </FormField>
  );
};
Select.displayName = "Select";
