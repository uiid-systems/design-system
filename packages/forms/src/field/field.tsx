"use client";

import { Group } from "@uiid/layout";
import { cxState, isRenderable, useComposedRefs } from "@uiid/utils";
import { useState } from "react";

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

  // The error and the description share one slot: while Base UI has the error
  // mounted, the description unmounts. Unmounting matters, not just hiding:
  // each part adds its id to the control's `aria-describedby` on mount and
  // removes it on unmount, so the control is described by what is on screen.
  const [errorNode, setErrorNode] = useState<HTMLDivElement | null>(null);
  const errorRef = useComposedRefs(ErrorProps?.ref, setErrorNode);

  return (
    <FieldRoot
      data-required={required || undefined}
      {...props}
      {...RootProps}
      className={cxState(
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

      <FieldError {...ErrorProps} ref={errorRef} />
      {hasDescription && !errorNode && (
        <FieldDescription {...DescriptionProps}>{description}</FieldDescription>
      )}
    </FieldRoot>
  );
};
Field.displayName = "Field";
