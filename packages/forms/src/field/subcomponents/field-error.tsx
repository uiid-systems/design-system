import { Field as BaseField } from "@base-ui/react/field";

import { Text } from "@uiid/typography";

import type { FieldErrorProps } from "../field.types";

export const FieldError = ({ children, ...props }: FieldErrorProps) => {
  return (
    <BaseField.Error
      data-slot="field-error"
      render={<Text size={0} shade="negative" />}
      {...props}
    >
      {children}
    </BaseField.Error>
  );
};
FieldError.displayName = "FieldError";
