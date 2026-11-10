"use client";

import { Field as BaseField } from "@base-ui/react/field";

import { useFieldRequired } from "../field-required-context";
import type { FieldControlProps } from "../field.types";

export const FieldControl = ({ required, ...props }: FieldControlProps) => {
  const fieldRequired = useFieldRequired();
  return (
    <BaseField.Control
      data-slot="field-control"
      required={required ?? fieldRequired}
      {...props}
    />
  );
};
FieldControl.displayName = "FieldControl";
