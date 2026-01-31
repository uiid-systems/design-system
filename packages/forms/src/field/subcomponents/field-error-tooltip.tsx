"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { TriangleAlertIcon } from "@uiid/icons";
import { Tooltip } from "@uiid/overlays";

import { FIELD_TOOLTIP_DELAY } from "../field.constants";
import type { FieldErrorProps } from "../field.types";
import styles from "../field.module.css";

export const FieldErrorTooltip = (props: FieldErrorProps) => {
  return (
    <BaseField.Error
      data-slot="field-error-tooltip"
      render={
        <Tooltip
          delay={FIELD_TOOLTIP_DELAY}
          PositionerProps={{ align: "end" }}
          PopupProps={{ style: { backgroundColor: "var(--tone-critical)" } }}
          trigger={
            <span className={styles["field-error-tooltip"]}>
              <TriangleAlertIcon color="var(--tone-critical)" />
            </span>
          }
        />
      }
      {...props}
    />
  );
};
FieldErrorTooltip.displayName = "FieldErrorTooltip";
