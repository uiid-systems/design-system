"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import { TOOLTIP_DEFAULT_DELAY } from "../tooltip.constants";
import { HasTooltipProviderContext } from "../tooltip.context";
import type { TooltipProviderProps } from "../tooltip.types";

/**
 * Groups the tooltips inside it: once one is open, moving to a neighbouring
 * trigger opens its tooltip without the delay.
 */
export const TooltipProvider = ({
  delay = TOOLTIP_DEFAULT_DELAY,
  children,
  ...props
}: TooltipProviderProps) => {
  return (
    <BaseTooltip.Provider data-slot="tooltip-provider" delay={delay} {...props}>
      <HasTooltipProviderContext.Provider value>
        {children}
      </HasTooltipProviderContext.Provider>
    </BaseTooltip.Provider>
  );
};
TooltipProvider.displayName = "TooltipProvider";
