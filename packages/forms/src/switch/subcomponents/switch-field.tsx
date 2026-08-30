"use client";

import { cx } from "@uiid/utils";

import { checkboxVariants } from "../../checkbox/checkbox.variants";
import { FieldRow } from "../../field/subcomponents";
import type { SwitchFieldProps } from "../switch.types";

import styles from "../switch.module.css";

export const SwitchField = ({
  reversed,
  bordered,
  className,
  children,
  ...props
}: SwitchFieldProps) => {
  return (
    <FieldRow
      className={cx(
        styles["switch-label"],
        checkboxVariants({ reversed, bordered }),
        className,
      )}
      {...props}
    >
      {children}
    </FieldRow>
  );
};
SwitchField.displayName = "SwitchField";
