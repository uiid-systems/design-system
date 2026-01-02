import type { FieldProps } from "./field.types";

import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "./subcomponents";

export const Field = ({
  /** data */
  name,
  label,
  description,
  required,
  /** subcomponents */
  RootProps,
  LabelProps,
  ErrorProps,
  DescriptionProps,
  /** misc */
  children,
  ...props
}: FieldProps) => {
  return (
    <FieldRoot name={name} {...props} {...RootProps}>
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
