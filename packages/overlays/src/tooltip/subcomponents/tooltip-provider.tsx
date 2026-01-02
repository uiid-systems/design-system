"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import type { TooltipProviderProps } from "../tooltip.types";

export const TooltipProvider = ({
  children,
  ...props
}: TooltipProviderProps) => {
  return (
    <BaseTooltip.Provider data-slot="tooltip-provider" {...props}>
      {children}
    </BaseTooltip.Provider>
  );
};
TooltipProvider.displayName = "TooltipProvider";
