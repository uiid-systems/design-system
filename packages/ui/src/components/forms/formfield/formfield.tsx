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
  ...props
}: FormFieldProps) => (
  <Slots
    data-slot="formfield"
    before={<Label label={label} name={name} required={required} />}
    after={<Description description={description} />}
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

const Description = ({ description }: Pick<FormFieldProps, "description">) =>
  description && <FormFieldDescription>{description}</FormFieldDescription>;
