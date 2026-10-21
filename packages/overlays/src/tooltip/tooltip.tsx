"use client";

import { hasTrigger } from "@uiid/utils";

import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
} from "./subcomponents";
import { useHasTooltipProvider } from "./tooltip.context";
import type { TooltipProps } from "./tooltip.types";

export const Tooltip = ({
  trigger,
  delay,
  open,
  onOpenChange,
  ProviderProps,
  RootProps,
  TriggerProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  children,
}: TooltipProps) => {
  const hasProvider = useHasTooltipProvider();

  const tooltip = (
    <TooltipRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
      {hasTrigger(trigger, TriggerProps?.render) && (
        <TooltipTrigger delay={delay} {...TriggerProps}>
          {trigger}
        </TooltipTrigger>
      )}
      <TooltipPortal {...PortalProps}>
        <TooltipPositioner {...PositionerProps}>
          <TooltipPopup {...PopupProps}>{children}</TooltipPopup>
        </TooltipPositioner>
      </TooltipPortal>
    </TooltipRoot>
  );

  // A provider of its own would shadow a surrounding one and break its
  // grouping, so only a Tooltip outside any TooltipProvider mounts one.
  return hasProvider ? (
    tooltip
  ) : (
    <TooltipProvider {...ProviderProps}>{tooltip}</TooltipProvider>
  );
};
Tooltip.displayName = "Tooltip";
