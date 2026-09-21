"use client";

import { Group } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { FieldProps } from "./field.types";
import { fieldVariants } from "./field.variants";
import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldErrorTooltip,
  FieldAction,
} from "./subcomponents";

import styles from "./field.module.css";

export const Field = ({
  label,
  action,
  errorType = "inline",
  description,
  required,
  size,
  RootProps,
  LabelProps,
  ErrorProps,
  ActionProps,
  DescriptionProps,
  className,
  children,
  ...props
}: FieldProps) => {
  const isFloating = errorType === "absolute";

  const Action = ActionProps?.children || action;
  const hasAction = Boolean(Action);

  // No label, action, description, or out-of-flow error means this field paints
  // no chrome of its own, so the root should not participate in layout.
  const hasChrome =
    Boolean(label || hasAction || description) || errorType !== "inline";

  return (
    <FieldRoot
      {...props}
      {...RootProps}
      className={cxState(
        fieldVariants({ size }),
        isFloating && styles["field-root-floating"],
        !hasChrome && styles["field-root-bare"],
        className,
        RootProps?.className,
      )}
    >
      {(label || hasAction || errorType === "tooltip") && (
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
            {hasAction && <FieldAction {...ActionProps}>{Action}</FieldAction>}
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
