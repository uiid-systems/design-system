import type { FieldProps } from "./field.types";

import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "./subcomponents";

export const Field = ({
  name,
  label,
  description,
  required,
  fullwidth,
  RootProps,
  LabelProps,
  ErrorProps,
  DescriptionProps,
  children,
  ...props
}: FieldProps) => {
  return (
    <FieldRoot name={name} fullwidth={fullwidth} {...RootProps} {...props}>
      {label && (
        <FieldLabel required={required} {...LabelProps}>
          {label}
        </FieldLabel>
      )}

      {children}

      <FieldError {...ErrorProps} />

      {description && (
        <FieldDescription {...DescriptionProps}>{description}</FieldDescription>
      )}
    </FieldRoot>
  );
};
Field.displayName = "Field";
