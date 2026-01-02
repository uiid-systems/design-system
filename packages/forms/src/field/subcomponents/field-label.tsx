import { Field as BaseField } from "@base-ui/react/field";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { FieldLabelProps } from "../field.types";
import styles from "../field.module.css";

export const FieldLabel = ({
  required,
  className,
  children,
  ...props
}: FieldLabelProps) => {
  return (
    <BaseField.Label
      data-slot="field-label"
      render={<Text size={1} bold />}
      className={cx(styles["field-label"], className)}
      data-required={required}
      {...props}
    >
      {children}
    </BaseField.Label>
  );
};
FieldLabel.displayName = "FieldLabel";
