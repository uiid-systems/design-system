import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { FieldProps } from "./field.types";
import styles from "./field.module.css";

import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldErrorTooltip,
} from "./subcomponents";
import { FieldHint } from "./subcomponents/field-hint";

export const Field = ({
  label,
  hint,
  errorType = "inline",
  description,
  required,
  RootProps,
  LabelProps,
  ErrorProps,
  HintProps,
  DescriptionProps,
  children,
  ...props
}: FieldProps) => {
  const isFloating = errorType === "absolute";

  return (
    <FieldRoot
      {...props}
      {...RootProps}
      className={cx(
        isFloating && styles["field-root-floating"],
        RootProps?.className,
      )}
    >
      {(label || hint || errorType === "tooltip") && (
        <Group
          className={styles["field-label-group"]}
          ax="space-between"
          ay="center"
        >
          {label && (
            <FieldLabel required={required} {...LabelProps}>
              {label}
            </FieldLabel>
          )}

          <Group ay="center">
            {errorType === "tooltip" && <FieldErrorTooltip {...ErrorProps} />}
            {hint && <FieldHint {...hint} {...HintProps} />}
          </Group>
        </Group>
      )}

      {children}

      {errorType === "absolute" && (
        <FieldError
          className={styles["field-error-absolute"]}
          {...ErrorProps}
        />
      )}
      {errorType === "inline" && <FieldError {...ErrorProps} />}

      {description && (
        <FieldDescription {...DescriptionProps}>{description}</FieldDescription>
      )}
    </FieldRoot>
  );
};
Field.displayName = "Field";
