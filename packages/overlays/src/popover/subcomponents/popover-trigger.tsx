import { Popover as BasePopover } from "@base-ui/react/popover";
import { resolveTrigger } from "@uiid/utils";

import type { PopoverTriggerProps } from "../popover.types";

export const PopoverTrigger = ({
  children,
  render,
  nativeButton,
  ...props
}: PopoverTriggerProps) => {
  const resolved = resolveTrigger(children, render);

  return (
    <BasePopover.Trigger
      data-slot="popover-trigger"
      {...props}
      render={render ?? resolved.render}
      nativeButton={nativeButton ?? resolved.nativeButton}
    >
      {resolved.children}
    </BasePopover.Trigger>
  );
};
PopoverTrigger.displayName = "PopoverTrigger";
