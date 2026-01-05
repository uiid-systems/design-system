"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import { Text } from "@uiid/typography";
import { Card } from "@uiid/cards";

import type { TooltipPopupProps } from "../tooltip.types";

export const TooltipPopup = ({ children, ...props }: TooltipPopupProps) => {
  return (
    <BaseTooltip.Popup
      data-slot="tooltip-popup"
      render={<Card py={2} px={2} inverted />}
      data-is-popup
      {...props}
    >
      <Text size={-1}>{children}</Text>
    </BaseTooltip.Popup>
  );
};
TooltipPopup.displayName = "TooltipPopup";
