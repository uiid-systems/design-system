import { Slots } from "../../layout";
import type { FormProps } from "../types";
import { FormFieldLabel } from "./formfield-label";
import { FormFieldDescription } from "./formfield-description";

import "./formfield.css";

type FormFieldProps = React.PropsWithChildren &
  Pick<FormProps, "name" | "label" | "description" | "required">;

export const FormField = ({
  name,
  label,
  description,
  required,
  children,
  ...props
}: FormFieldProps) => {
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
      data-slot="formfield"
      before={<Label />}
      after={<Description />}
      {...props}
    >
      {children}
    </Slots>
  );
};
FormField.displayName = "FormField";
