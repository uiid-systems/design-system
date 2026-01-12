"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import type { TooltipPositionerProps } from "../tooltip.types";

export const TooltipPositioner = ({
  children,
  ...props
}: TooltipPositionerProps) => {
  return (
    <BaseTooltip.Positioner
      data-slot="tooltip-positioner"
      style={{ zIndex: 1000 }}
      {...props}
    >
      {children}
    </BaseTooltip.Positioner>
  );
};
TooltipPositioner.displayName = "TooltipPositioner";
