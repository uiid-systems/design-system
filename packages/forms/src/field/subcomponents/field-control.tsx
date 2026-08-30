"use client";

import { Field as BaseField } from "@base-ui/react/field";

import type { FieldControlProps } from "../field.types";

export const FieldControl = (props: FieldControlProps) => {
  return <BaseField.Control data-slot="field-control" {...props} />;
};
FieldControl.displayName = "FieldControl";
