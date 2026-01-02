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
      {label && <FieldLabel {...LabelProps}>{label}</FieldLabel>}

      {children}

      <FieldError match {...ErrorProps} />

      {description && (
        <FieldDescription {...DescriptionProps}>{description}</FieldDescription>
      )}
    </FieldRoot>
  );
};
Field.displayName = "Field";
