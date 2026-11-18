"use client";

import { cx } from "@uiid/utils";

import { checkboxVariants } from "../../checkbox/checkbox.variants";
import { FieldRow } from "../../field/subcomponents";
import type { SwitchFieldProps } from "../switch.types";

import styles from "../switch.module.css";

export const SwitchField = ({
  size,
  reversed,
  bordered,
  children,
  ...props
}: SwitchFieldProps) => {
  return (
    <FieldRow
      size={size}
      {...props}
      frameClassName={cx(
        styles["switch-label"],
        checkboxVariants({ reversed, bordered }),
      )}
    >
      {children}
    </FieldRow>
  );
};
SwitchField.displayName = "SwitchField";
