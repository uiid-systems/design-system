"use client";

import { cx } from "@uiid/utils";

import { FieldRow } from "../../field/subcomponents";
import type { CheckboxFieldProps } from "../checkbox.types";
import { checkboxVariants } from "../checkbox.variants";

import styles from "../checkbox.module.css";

export const CheckboxField = ({
  size,
  reversed,
  bordered,
  children,
  ...props
}: CheckboxFieldProps) => {
  return (
    <FieldRow
      size={size}
      frameClassName={cx(
        styles["checkbox-label"],
        checkboxVariants({ reversed, bordered }),
      )}
      {...props}
    >
      {children}
    </FieldRow>
  );
};
CheckboxField.displayName = "CheckboxField";
