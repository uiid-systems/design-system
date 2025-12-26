import { Field as BaseField } from "@base-ui/react/field";

import { ConditionalRender, Stack } from "@uiid/layout";

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
    <ConditionalRender
      condition={Boolean(label || description || error)}
      render={
        <BaseField.Root
          data-slot="field"
          render={<Stack gap={3} ax="stretch" fullwidth />}
          {...props}
        />
      }
    >
      {label && (
        <BaseField.Label
          data-slot="field-label"
          render={<FieldLabel />}
          {...LabelProps}
        >
          {label}
        </BaseField.Label>
      )}

      {children}

      {error && (
        <BaseField.Error
          data-slot="field-error"
          match="valueMissing"
          {...ErrorProps}
        >
          {error}
        </BaseField.Error>
      )}

      {description && (
        <BaseField.Description
          data-slot="field-description"
          render={<FieldDescription />}
          {...DescriptionProps}
        >
          {description}
        </BaseField.Description>
      )}
    </ConditionalRender>
  );
};
Field.displayName = "Field";
