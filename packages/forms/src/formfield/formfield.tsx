import { ConditionalRender, Slots, Group } from "@uiid/layout";

import {
  FormFieldLabel,
  FormFieldDescription,
  FormFieldHint,
} from "./subcomponents";
import type { FormFieldProps } from "./formfield.types";
import "./formfield.styles.css";

export const FormField = ({ children, ...props }: FormFieldProps) => {
  const hasLabel = Boolean(props.label);
  const hasDescription = Boolean(props.description);

  return (
    <ConditionalRender
      condition={hasLabel || hasDescription}
      render={<Wrapper {...props} />}
    >
      {children}
    </ConditionalRender>
  );
};
FormField.displayName = "FormField";

const Wrapper = ({
  label,
  description,
  hint,
  name,
  required,
  hasError,
  ...props
}: FormFieldProps) => (
  <Slots
    data-slot="formfield"
    before={
      (label || hint) && (
        <ConditionalRender
          condition={Boolean(label && hint)}
          render={<Group fullwidth ax="space-between" ay="center" gap={8} />}
        >
          {label && (
            <FormFieldLabel htmlFor={name} data-required={required}>
              {label}
            </FormFieldLabel>
          )}
          {hint && <FormFieldHint>{hint}</FormFieldHint>}
        </ConditionalRender>
      )
    }
    after={
      description ? (
        <FormFieldDescription hasError={hasError}>
          {description}
        </FormFieldDescription>
      ) : undefined
    }
    {...props}
  />
);
