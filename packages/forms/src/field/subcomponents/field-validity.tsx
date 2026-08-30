"use client";

import { Field as BaseField } from "@base-ui/react/field";

import type { FieldValidityProps } from "../field.types";

/**
 * Renders no DOM element: `children` is a render function that receives the
 * field's validity state. There is no element to hang a `data-slot` on, so
 * this wrapper exists only to make the part reachable under the UIID name.
 */
export const FieldValidity = ({ children }: FieldValidityProps) => {
  return <BaseField.Validity>{children}</BaseField.Validity>;
};
FieldValidity.displayName = "FieldValidity";
