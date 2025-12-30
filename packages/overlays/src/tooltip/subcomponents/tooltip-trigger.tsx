import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { isValidElement } from "react";

import type { TooltipTriggerProps } from "../tooltip.types";

export const TooltipTrigger = ({ children, ...props }: TooltipTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BaseTooltip.Trigger
      data-slot="tooltip-trigger"
      render={
        triggerIsEl ? (
          children
        ) : (
          <span role="button" tabIndex={0}>
            {children}
          </span>
        )
      }
      {...props}
    >
      {children}
    </BaseTooltip.Trigger>
  );
};
TooltipTrigger.displayName = "TooltipTrigger";
