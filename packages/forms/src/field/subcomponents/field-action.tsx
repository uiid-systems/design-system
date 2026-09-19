"use client";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { FieldActionProps } from "../field.types";

import styles from "../field.module.css";

export const FieldAction = ({
  children,
  className,
  ...props
}: FieldActionProps) => {
  return (
    <Group
      data-slot="field-action"
      className={cx(styles["field-action"], className)}
      ay="center"
      gap={2}
      {...props}
    >
      {children}
    </Group>
  );
};
FieldAction.displayName = "FieldAction";
