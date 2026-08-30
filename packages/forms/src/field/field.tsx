"use client";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { FieldProps } from "./field.types";
import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldErrorTooltip,
  FieldHint,
} from "./subcomponents";

import styles from "./field.module.css";

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
  className,
  children,
  ...props
}: FieldProps) => {
  const isFloating = errorType === "absolute";
  // No label, hint, description, or out-of-flow error means this field paints
  // no chrome of its own, so the root should not participate in layout.
  const hasChrome =
    Boolean(label || hint || description) || errorType !== "inline";

  return (
    <FieldRoot
      {...props}
      {...RootProps}
      className={cx(
        isFloating && styles["field-root-floating"],
        !hasChrome && styles["field-root-bare"],
        className,
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
