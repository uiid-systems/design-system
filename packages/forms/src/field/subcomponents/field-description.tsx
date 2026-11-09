"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { FieldDescriptionProps } from "../field.types";

import styles from "../field.module.css";

export const FieldDescription = ({
  className,
  children,
  ...props
}: FieldDescriptionProps) => {
  return (
    <BaseField.Description
      data-slot="field-description"
      render={<Text shade="muted" />}
      className={cx(styles["field-description"], className)}
      {...props}
    >
      {children}
    </BaseField.Description>
  );
};
FieldDescription.displayName = "FieldDescription";
