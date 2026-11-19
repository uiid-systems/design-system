"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { FieldDescriptionProps } from "../field.types";

import styles from "../field.module.css";

export const FieldDescription = ({
  emphasis,
  color,
  className,
  children,
  ...props
}: FieldDescriptionProps) => {
  return (
    <BaseField.Description
      data-slot="field-description"
      render={
        <Text
          color={color}
          emphasis={emphasis ?? (color ? undefined : "muted")}
        />
      }
      className={cx(styles["field-description"], className)}
      {...props}
    >
      {children}
    </BaseField.Description>
  );
};
FieldDescription.displayName = "FieldDescription";
