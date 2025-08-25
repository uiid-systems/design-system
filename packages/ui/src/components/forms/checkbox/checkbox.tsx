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
  indeterminate,
  ref,
  ...props
}: CheckboxProps) => {
  const hasLabel = Boolean(label);
  const hasDescription = Boolean(description);

  // Ref callback to handle indeterminate state without hooks
  const handleRef = (element: HTMLInputElement | null) => {
    if (element) {
      element.indeterminate = Boolean(indeterminate);
    }
    
    // Forward the ref if provided
    if (ref) {
      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
      }
    }
  };

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
          ref={handleRef}
          data-uiid="checkbox"
          type="checkbox"
          data-validate={validate ? true : undefined}
          data-indeterminate={indeterminate ? true : undefined}
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
