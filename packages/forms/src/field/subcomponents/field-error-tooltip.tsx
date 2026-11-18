"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { TriangleAlertIcon } from "@uiid/icons/triangle-alert";
import { Tooltip } from "@uiid/overlays";
import { paletteColorStyles } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import { FIELD_TOOLTIP_DELAY } from "../field.constants";
import type { FieldErrorProps } from "../field.types";

import styles from "../field.module.css";

/**
 * Base UI points the control's `aria-describedby` at this element's `id`, so
 * the element has to exist and hold the message itself: the tooltip popup is
 * portalled and only mounted while open. The message is kept here visually
 * hidden, and the icon shows it in the popup.
 */
export const FieldErrorTooltip = (props: FieldErrorProps) => {
  return (
    <BaseField.Error
      data-slot="field-error-tooltip"
      render={({ children, ...errorProps }) => (
        <div {...errorProps}>
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
          >
            {children}
          </Tooltip>
          <div className="sr-only">{children}</div>
        </div>
      )}
      {...props}
    />
  );
};
FieldErrorTooltip.displayName = "FieldErrorTooltip";
