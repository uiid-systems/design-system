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
  delay,
  open,
  onOpenChange,
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
    <TooltipProvider delay={delay} {...ProviderProps}>
      <TooltipRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
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
