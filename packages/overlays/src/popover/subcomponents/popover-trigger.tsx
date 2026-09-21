import { Popover as BasePopover } from "@base-ui/react/popover";
import { resolveTrigger } from "@uiid/utils";

import type { PopoverTriggerProps } from "../popover.types";

export const PopoverTrigger = ({ children, ...props }: PopoverTriggerProps) => (
  <BasePopover.Trigger
    data-slot="popover-trigger"
    {...resolveTrigger(children, props.render)}
    {...props}
  />
);
PopoverTrigger.displayName = "PopoverTrigger";
