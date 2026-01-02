"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import type { TooltipRootProps } from "../tooltip.types";

export const TooltipRoot = ({ children, ...props }: TooltipRootProps) => {
  return (
    <BaseTooltip.Root data-slot="tooltip-root" {...props}>
      {children}
    </BaseTooltip.Root>
  );
};
TooltipRoot.displayName = "TooltipRoot";
