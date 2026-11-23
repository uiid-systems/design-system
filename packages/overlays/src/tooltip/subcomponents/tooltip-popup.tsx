"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { Card } from "@uiid/cards";
import { Text } from "@uiid/typography";
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
      render={<Card shadow py={2} px={2} />}
      className={cx(styles["tooltip-popup"], className)}
      {...props}
    >
      <Text size={-1}>{children}</Text>
    </BaseTooltip.Popup>
  );
};
TooltipPopup.displayName = "TooltipPopup";
