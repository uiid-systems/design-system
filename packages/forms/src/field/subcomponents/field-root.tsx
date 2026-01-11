"use client";

import { Field as BaseField } from "@base-ui/react/field";

import { Stack } from "@uiid/layout";

import type { FieldRootProps } from "../field.types";

export const FieldRoot = ({
  children,
  fullwidth,
  ...props
}: FieldRootProps) => {
  return (
    <BaseField.Root
      data-slot="field-root"
      render={<Stack gap={3} ax="stretch" fullwidth={fullwidth} />}
      {...props}
    >
      {children}
    </BaseField.Root>
  );
};
FieldRoot.displayName = "FieldRoot";
