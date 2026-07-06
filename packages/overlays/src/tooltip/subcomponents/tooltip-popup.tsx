"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import { Text } from "@uiid/typography";
import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { TooltipPopupProps } from "../tooltip.types";
import styles from "../tooltip.module.css";

export const TooltipPopup = ({
  children,
  className,
  ...props
}: TooltipPopupProps) => {
  return (
    <BaseTooltip.Popup
      data-slot="tooltip-popup"
      render={
        <Card
          py={2}
          px={2}
          style={{
            backgroundColor: "var(--shade-foreground)",
            color: "var(--shade-background)",
          }}
        />
      }
      className={cx(styles["tooltip-popup"], className)}
      {...props}
    >
      <Text size={-1}>{children}</Text>
    </BaseTooltip.Popup>
  );
};
TooltipPopup.displayName = "TooltipPopup";
