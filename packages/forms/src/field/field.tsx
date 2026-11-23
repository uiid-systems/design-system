"use client";

import { Group } from "@uiid/layout";
import { cx, definedProps, isRenderable } from "@uiid/utils";

import { FieldRequiredProvider } from "./field-required-context";
import type { FieldProps } from "./field.types";
import { fieldVariants } from "./field.variants";
import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldAction,
} from "./subcomponents";
import { useFieldErrorSlot } from "./use-field-error-slot";

import styles from "./field.module.css";

export const Field = ({
  label,
  action,
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
  const Action = ActionProps?.children ?? action;
  const hasLabel = isRenderable(label);
  const hasAction = isRenderable(Action);
  const hasDescription = isRenderable(description);

  // No label, action, or description means this field paints no chrome of its
  // own, so the root should not participate in layout until an error renders.
  const hasChrome = hasLabel || hasAction || hasDescription;

  // While the error shows, it takes the description's place.
  const { hasError, errorProps } = useFieldErrorSlot(ErrorProps);

  return (
    <FieldRoot
      data-required={required || undefined}
      {...RootProps}
      {...definedProps(props)}
      className={cx(
        fieldVariants({ size }),
        !hasChrome && styles["field-root-bare"],
        className,
        RootProps?.className,
      )}
    >
      {(hasLabel || hasAction) && (
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

          {hasAction && (
            <Group className={styles["field-label-end"]} ay="center">
              <FieldAction {...ActionProps}>{Action}</FieldAction>
            </Group>
          )}
        </Group>
      )}

      <FieldRequiredProvider value={Boolean(required)}>
        {children}
      </FieldRequiredProvider>

      <FieldError {...errorProps} />
      {hasDescription && !hasError && (
        <FieldDescription {...DescriptionProps}>{description}</FieldDescription>
      )}
    </FieldRoot>
  );
};
Field.displayName = "Field";
