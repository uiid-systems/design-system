"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import type { TooltipPortalProps } from "../tooltip.types";

export const TooltipPortal = ({ children, ...props }: TooltipPortalProps) => {
  return (
    <BaseTooltip.Portal data-slot="tooltip-portal" {...props}>
      {children}
    </BaseTooltip.Portal>
  );
};
TooltipPortal.displayName = "TooltipPortal";
