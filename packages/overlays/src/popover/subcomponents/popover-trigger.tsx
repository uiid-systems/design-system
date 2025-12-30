import { Popover as BasePopover } from "@base-ui/react/popover";
import { isValidElement } from "react";

import type { PopoverTriggerProps } from "../popover.types";

export const PopoverTrigger = ({ children, ...props }: PopoverTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BasePopover.Trigger
      data-slot="popover-trigger"
      nativeButton={triggerIsEl}
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
    />
  );
};
PopoverTrigger.displayName = "PopoverTrigger";
