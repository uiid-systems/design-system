"use client";

import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { FieldHintValue, FieldHintProps } from "../field.types";

import styles from "../field.module.css";

export const FieldHint = ({
  icon: Icon,
  text,
  className,
  ...props
}: FieldHintValue & FieldHintProps) => (
  <span
    data-slot="field-hint"
    className={cx(styles["field-hint"], className)}
    {...props}
  >
    {Icon && <Icon />}
    <Text size={-1}>{text}</Text>
  </span>
);
FieldHint.displayName = "FieldHint";
