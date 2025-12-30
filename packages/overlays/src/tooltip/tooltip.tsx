"use client";

import type { TooltipProps } from "./tooltip.types";
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
} from "./subcomponents";

export const Tooltip = ({
  trigger,
  ProviderProps,
  RootProps,
  TriggerProps,
  PortalProps,
  PositionerProps = {
    sideOffset: 8,
    collisionPadding: 16,
  },
  PopupProps,
  children,
}: TooltipProps) => {
  return (
    <TooltipProvider {...ProviderProps}>
      <TooltipRoot {...RootProps}>
        <TooltipTrigger {...TriggerProps}>{trigger}</TooltipTrigger>
        <TooltipPortal {...PortalProps}>
          <TooltipPositioner {...PositionerProps}>
            <TooltipPopup {...PopupProps}>{children}</TooltipPopup>
          </TooltipPositioner>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
};
Tooltip.displayName = "Tooltip";
