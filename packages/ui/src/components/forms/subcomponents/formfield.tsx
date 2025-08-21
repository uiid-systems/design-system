import { Slots } from "../../layout";

import { FormFieldLabel } from "./formfield-label";
import { FormFieldDescription } from "./formfield-description";

export type FormFieldProps = {
  name?: string;
  /** Label text above the input field */
  label?: string;
  /** Description text below the input field */
  description?: React.ReactNode;
  /** While true, displays an asterisk after the label */
  required?: boolean;
} & React.PropsWithChildren;

export const FormField = ({
  name,
  label,
  description,
  required,
  children,
  ...props
}: FormFieldProps & React.PropsWithChildren) => {
  const Label = () => {
    return (
      label && (
        <FormFieldLabel htmlFor={name} data-required={required}>
          {label}
        </FormFieldLabel>
      )
    );
  };

  const Description = () => {
    return (
      description && <FormFieldDescription>{description}</FormFieldDescription>
    );
  };

  return (
    <Slots
      uiid="formfield"
      before={<Label />}
      after={<Description />}
      {...props}
    >
      {children}
    </Slots>
  );
};
FormField.displayName = "FormField";
