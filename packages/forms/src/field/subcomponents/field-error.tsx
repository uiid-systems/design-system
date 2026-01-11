"use client";

import { Field as BaseField } from "@base-ui/react/field";

import { Text } from "@uiid/typography";

import type { FieldErrorProps } from "../field.types";

export const FieldError = (props: FieldErrorProps) => {
  return (
    <BaseField.Error
      data-slot="field-error"
      render={<Text tone="negative" />}
      {...props}
    />
  );
};
FieldError.displayName = "FieldError";
