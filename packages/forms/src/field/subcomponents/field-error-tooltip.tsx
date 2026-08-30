"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { TriangleAlertIcon } from "@uiid/icons/triangle-alert";
import { Tooltip } from "@uiid/overlays";
import { paletteColorStyles } from "@uiid/tokens";
import { cx } from "@uiid/utils";

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
          trigger={
            <span
              className={cx(
                styles["field-error-tooltip"],
                paletteColorStyles.red,
              )}
            >
              <TriangleAlertIcon />
            </span>
          }
        />
      }
      {...props}
    />
  );
};
FieldErrorTooltip.displayName = "FieldErrorTooltip";
