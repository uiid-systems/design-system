"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { resolveTrigger } from "@uiid/utils";

import type { TooltipTriggerProps } from "../tooltip.types";

/**
 * Unlike Dialog's, Base UI's tooltip trigger takes no `nativeButton`, so only
 * the resolved `render` and children are passed on.
 */
export const TooltipTrigger = ({
  children,
  render,
  ...props
}: TooltipTriggerProps) => {
  const resolved = resolveTrigger(children, render);

  return (
    <BaseTooltip.Trigger
      data-slot="tooltip-trigger"
      {...props}
      render={render ?? resolved.render}
    >
      {resolved.children}
    </BaseTooltip.Trigger>
  );
};
TooltipTrigger.displayName = "TooltipTrigger";
