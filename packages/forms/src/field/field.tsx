import { Field as BaseField } from "@base-ui-components/react/field";

import { Stack } from "@uiid/layout";

import type { FieldProps } from "./field.types";

import { FieldLabel, FieldDescription } from "./subcomponents";

export const Field = ({
  children,
  label,
  description,
  error,
  LabelProps,
  ErrorProps,
  DescriptionProps,
  ...props
}: FieldProps) => {
  return (
    <BaseField.Root
      data-slot="field"
      render={<Stack gap={3} fullwidth />}
      {...props}
    >
      <BaseField.Label
        data-slot="field-label"
        render={<FieldLabel />}
        {...LabelProps}
      >
        {label}
      </BaseField.Label>

      {children}

      <BaseField.Error
        data-slot="field-error"
        match="valueMissing"
        {...ErrorProps}
      >
        {error}
      </BaseField.Error>

      <BaseField.Description
        data-slot="field-description"
        render={<FieldDescription />}
        {...DescriptionProps}
      >
        {description}
      </BaseField.Description>
    </BaseField.Root>
  );
};
Field.displayName = "Field";
