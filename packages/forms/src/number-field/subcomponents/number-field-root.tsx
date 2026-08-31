"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import type { NumberFieldRootProps } from "../number-field.types";

/**
 * Groups all parts and manages state. The visible control cluster — and its
 * surface and focus ring — is `NumberFieldGroup`, matching Base UI's anatomy of
 * `Root > (ScrubArea, Group > Decrement/Input/Increment)`.
 */
export const NumberFieldRoot = (props: NumberFieldRootProps) => {
  return <BaseNumberField.Root data-slot="number-field-root" {...props} />;
};
NumberFieldRoot.displayName = "NumberFieldRoot";
