"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { Stack } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { FieldRootProps } from "../field.types";

import styles from "../field.module.css";

export const FieldRoot = ({
  ax = "stretch",
  children,
  className,
  ...props
}: FieldRootProps) => {
  return (
    <BaseField.Root
      data-slot="field-root"
      render={<Stack ax={ax} />}
      className={cxState(styles["field-root"], className)}
      {...props}
    >
      {children}
    </BaseField.Root>
  );
};
FieldRoot.displayName = "FieldRoot";
