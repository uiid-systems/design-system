"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import type { TooltipRootProps } from "../tooltip.types";

/** Groups all parts of the tooltip. Renders no element of its own. */
export const TooltipRoot = ({ children, ...props }: TooltipRootProps) => {
  return <BaseTooltip.Root {...props}>{children}</BaseTooltip.Root>;
};
TooltipRoot.displayName = "TooltipRoot";
