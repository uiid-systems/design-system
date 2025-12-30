import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import type { TooltipTriggerProps } from "../tooltip.types";

export const TooltipTrigger = ({ children, ...props }: TooltipTriggerProps) => {
  return <BaseTooltip.Trigger {...props}>{children}</BaseTooltip.Trigger>;
};
TooltipTrigger.displayName = "TooltipTrigger";
