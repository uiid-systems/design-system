"use client";

import { cx } from "@uiid/utils";

import { FieldRow } from "../../field/subcomponents";
import type { CheckboxFieldProps } from "../checkbox.types";
import { checkboxVariants } from "../checkbox.variants";

import styles from "../checkbox.module.css";

export const CheckboxField = ({
  reversed,
  bordered,
  className,
  children,
  ...props
}: CheckboxFieldProps) => {
  return (
    <FieldRow
      className={cx(
        styles["checkbox-label"],
        checkboxVariants({ reversed, bordered }),
        className,
      )}
      {...props}
    >
      {children}
    </FieldRow>
  );
};
CheckboxField.displayName = "CheckboxField";
