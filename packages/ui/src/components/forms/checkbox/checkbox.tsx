import { ConditionalRender, Group, Stack } from "../../layout";
import { FormFieldLabel, FormFieldDescription } from "../subcomponents";

import type { CheckboxProps } from "../types";

export const Checkbox = ({
  name,
  label,
  description,
  // required,
  disabled,
  validate,
  size,
  ...props
}: CheckboxProps) => {
  const hasLabel = Boolean(label);
  const hasDescription = Boolean(description);

  return (
    <FormFieldLabel
      data-size={size}
      data-validate={validate ? true : undefined}
      htmlFor={name}
    >
      <ConditionalRender
        condition={hasLabel}
        wrapper={<Group ay={hasDescription ? "start" : "center"} gap={2} />}
      >
        <input
          {...props}
          data-uiid="checkbox"
          type="checkbox"
          data-validate={validate ? true : undefined}
          name={name}
          id={name}
          /** @todo enable focus when disabled */
          tabIndex={disabled ? -1 : undefined}
          disabled={disabled}
        />
        <ConditionalRender
          condition={hasDescription}
          wrapper={<Stack gap={1} />}
        >
          {label && <span>{label}</span>}
          {label && description && (
            <FormFieldDescription>{description}</FormFieldDescription>
          )}
        </ConditionalRender>
      </ConditionalRender>
    </FormFieldLabel>
  );
};
Checkbox.displayName = "Checkbox";
