"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { Text } from "@uiid/typography";

import type { FieldDescriptionProps } from "../field.types";

export const FieldDescription = ({
  children,
  ...props
}: FieldDescriptionProps) => {
  return (
    <BaseField.Description
      data-slot="field-description"
      render={<Text shade="accent" />}
      {...props}
    >
      {children}
    </BaseField.Description>
  );
};
FieldDescription.displayName = "FieldDescription";
