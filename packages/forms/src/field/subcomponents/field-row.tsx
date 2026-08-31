"use client";

import { ConditionalRender, Group, Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { FieldRowProps } from "../field.types";
import { fieldRowVariants } from "../field.variants";
import { FieldDescription } from "./field-description";
import { FieldError } from "./field-error";
import { FieldItem } from "./field-item";
import { FieldLabel } from "./field-label";
import { FieldRoot } from "./field-root";

import styles from "../field.module.css";

/**
 * The shared row for controls that sit beside their label — checkbox, radio,
 * switch.
 *
 * Built on `Field.Item`, which scopes the label and description to *this* row's
 * control rather than the enclosing `Field.Root`'s. The control renders inside
 * the item, which is what lets Base UI's validity wiring reach it; the
 * hand-rolled versions this replaces rendered the control as a sibling
 * *before* their `Field.Root`, so it never joined the field at all.
 *
 * `Field.Item` throws without a `Field.Root` ancestor, so the row supplies one.
 * It is marked `display: contents` and therefore adds no layout of its own; a
 * row used inside a group simply nests inside that group's root.
 *
 * The row never names that root. Base UI falls back to the name of the control
 * registered against it, and a control inside a checkbox or radio group
 * deliberately does not register — the group registers on its behalf. So a
 * standalone row resolves to its own control's name and shows that control's
 * form error, while a grouped row stays nameless and leaves the message to the
 * group's field. Naming the root here instead would match the group's name on
 * every row and paint the same error once per item (UI-190).
 *
 * `size` paints no dimension here — the control inside carries its own tier —
 * it only publishes the inset a `bordered` row reads, so the treatment scales
 * with the control it wraps.
 */
export const FieldRow = ({
  size,
  label,
  description,
  LabelProps,
  DescriptionProps,
  ErrorProps,
  className,
  children,
  ...props
}: FieldRowProps) => {
  const hasContent = Boolean(label || description);
  const needsTextContainer = Boolean(label) && Boolean(description);

  return (
    <FieldRoot className={styles["field-root-bare"]}>
      <FieldItem
        data-slot="field-row"
        className={cx(
          fieldRowVariants({ size }),
          hasContent ? className : styles["field-row-bare"],
        )}
        render={
          <Group
            ay={needsTextContainer ? "start" : "center"}
            gap={3}
            {...props}
          />
        }
      >
        {children}
        {hasContent && (
          <ConditionalRender
            condition={needsTextContainer}
            render={<Stack gap={3} />}
          >
            {label && (
              <FieldLabel weight="normal" {...LabelProps}>
                {label}
              </FieldLabel>
            )}
            {description && (
              <FieldDescription {...DescriptionProps}>
                {description}
              </FieldDescription>
            )}
            <FieldError {...ErrorProps} />
          </ConditionalRender>
        )}
      </FieldItem>
    </FieldRoot>
  );
};
FieldRow.displayName = "FieldRow";
