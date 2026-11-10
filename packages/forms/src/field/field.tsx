"use client";

import { Group } from "@uiid/layout";
import { cxState, isRenderable } from "@uiid/utils";

import { FieldRequiredProvider } from "./field-required-context";
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
  const hasLabel = isRenderable(label);
  const hasAction = isRenderable(Action);
  const hasDescription = isRenderable(description);

  // No label, action, description, or out-of-flow error means this field paints
  // no chrome of its own, so the root should not participate in layout.
  const hasChrome =
    hasLabel || hasAction || hasDescription || errorType !== "inline";

  return (
    <FieldRoot
      data-required={required || undefined}
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
      {(hasLabel || hasAction || errorType === "tooltip") && (
        <Group
          className={styles["field-label-group"]}
          ax="space-between"
          ay="center"
        >
          {hasLabel && (
            <FieldLabel {...LabelProps} required={required}>
              {label}
            </FieldLabel>
          )}

          <Group ay="center">
            {errorType === "tooltip" && <FieldErrorTooltip {...ErrorProps} />}
            {hasAction && <FieldAction {...ActionProps}>{Action}</FieldAction>}
          </Group>
        </Group>
      )}

      <FieldRequiredProvider value={Boolean(required)}>
        {children}
      </FieldRequiredProvider>

      {errorType === "absolute" && (
        <FieldError
          className={styles["field-error-absolute"]}
          {...ErrorProps}
        />
      )}
      {errorType === "inline" && <FieldError {...ErrorProps} />}

      {hasDescription && (
        <FieldDescription {...DescriptionProps}>{description}</FieldDescription>
      )}
    </FieldRoot>
  );
};
Field.displayName = "Field";
