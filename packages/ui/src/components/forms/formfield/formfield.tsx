import { ConditionalRender, Slots } from "../../layout";
import { FormFieldLabel, FormFieldDescription } from "./subcomponents";
import type { FormFieldProps } from "./formfield.types";

import "./formfield.styles.css";

export const FormField = ({ children, ...props }: FormFieldProps) => {
  const hasLabel = Boolean(props.label);
  const hasDescription = Boolean(props.description);

  return (
    <ConditionalRender
      condition={hasLabel || hasDescription}
      wrapper={<Wrapper {...props} />}
    >
      {children}
    </ConditionalRender>
  );
};
FormField.displayName = "FormField";

const Wrapper = ({
  label,
  description,
  name,
  required,
  hasError,
  ...props
}: FormFieldProps) => (
  <Slots
    data-slot="formfield"
    before={<Label label={label} name={name} required={required} />}
    after={<Description description={description} hasError={hasError} />}
    fullwidth={props.fullwidth}
    {...props}
  />
);

const Label = ({
  label,
  name,
  required,
}: Pick<FormFieldProps, "label" | "name" | "required">) =>
  label && (
    <FormFieldLabel htmlFor={name} data-required={required}>
      {label}
    </FormFieldLabel>
  );

const Description = ({
  description,
  hasError,
}: Pick<FormFieldProps, "description" | "hasError">) =>
  description && (
    <FormFieldDescription hasError={hasError}>
      {description}
    </FormFieldDescription>
  );
