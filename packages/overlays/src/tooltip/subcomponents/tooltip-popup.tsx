import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import { Card } from "@uiid/cards";

import type { TooltipPopupProps } from "../tooltip.types";

export const TooltipPopup = ({ children, ...props }: TooltipPopupProps) => {
  return (
    <BaseTooltip.Popup
      data-slot="tooltip-popup"
      render={<Card>{children}</Card>}
      data-is-popup
      {...props}
    >
      {children}
    </BaseTooltip.Popup>
  );
};
TooltipPopup.displayName = "TooltipPopup";
