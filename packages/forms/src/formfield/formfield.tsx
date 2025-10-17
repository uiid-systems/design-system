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
  hint,
  name,
  required,
  hasError,
  ...props
}: FormFieldProps) => (
  <Slots
    data-slot="formfield"
    before={
      <Headline label={label} hint={hint} required={required} name={name} />
    }
    after={<Description description={description} hasError={hasError} />}
    {...props}
  />
);

const Headline = ({ name, required, label, hint }: LabelProps & HintProps) =>
  (label || hint) && (
    <Group fullwidth ax="space-between" ay="center" gap={8}>
      {label && <Label label={label} name={name} required={required} />}
      {hint && <Hint hint={hint} />}
    </Group>
  );

type LabelProps = Pick<FormFieldProps, "label" | "name" | "required">;
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

type HintProps = Pick<FormFieldProps, "hint">;
const Hint = ({ hint }: HintProps) =>
  hint && <FormFieldHint>{hint}</FormFieldHint>;

type DescriptionProps = Pick<FormFieldProps, "description" | "hasError">;
const Description = ({ description, hasError }: DescriptionProps) =>
  description && (
    <FormFieldDescription hasError={hasError}>
      {description}
    </FormFieldDescription>
  );
