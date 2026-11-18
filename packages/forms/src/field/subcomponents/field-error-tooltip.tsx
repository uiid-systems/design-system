"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { Card } from "@uiid/cards";
import { TriangleAlertIcon } from "@uiid/icons/triangle-alert";
import { Popover } from "@uiid/overlays";
import { paletteColorStyles } from "@uiid/tokens";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import { FIELD_TOOLTIP_DELAY } from "../field.constants";
import type { FieldErrorProps } from "../field.types";

import styles from "../field.module.css";

/**
 * Base UI points the control's `aria-describedby` at this element's `id`, so
 * the element has to exist and hold the message itself: the popup is
 * portalled and only mounted while open. The message is kept here visually
 * hidden, and the icon shows it in the popup.
 *
 * The icon is a Popover trigger opened on hover rather than a Tooltip, as Base
 * UI advises for an infotip: a tooltip opens only on hover or focus, so it
 * cannot be opened by touch or pressed from the keyboard. The Popover's Card
 * is swapped for a tooltip-sized one, which drops its Title and Description,
 * so the popup is named "Error" and described by the message. The message
 * renders as a `div` so a list of errors is not nested in a `span`.
 */
export const FieldErrorTooltip = (props: FieldErrorProps) => {
  return (
    <BaseField.Error
      data-slot="field-error-tooltip"
      render={({ children, ...errorProps }) => (
        <div {...errorProps}>
          <Popover
            TriggerProps={{ openOnHover: true, delay: FIELD_TOOLTIP_DELAY }}
            PositionerProps={{ align: "end" }}
            PopupProps={{
              "aria-label": "Error",
              render: <Card shadow py={2} px={2} />,
              className: styles["field-error-popup"],
            }}
            trigger={
              <span
                aria-label="Show error"
                className={cx(
                  styles["field-error-tooltip"],
                  paletteColorStyles.red,
                )}
              >
                <TriangleAlertIcon />
              </span>
            }
          >
            <BasePopover.Description
              render={<Text size={-1} render={<div />} />}
            >
              {children}
            </BasePopover.Description>
          </Popover>
          <div className="sr-only">{children}</div>
        </div>
      )}
      {...props}
    />
  );
};
FieldErrorTooltip.displayName = "FieldErrorTooltip";
