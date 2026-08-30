"use client";

import { Field as BaseField } from "@base-ui/react/field";

import type { FieldItemProps } from "../field.types";

export const FieldItem = ({ children, ...props }: FieldItemProps) => {
  return (
    <BaseField.Item data-slot="field-item" {...props}>
      {children}
    </BaseField.Item>
  );
};
FieldItem.displayName = "FieldItem";
