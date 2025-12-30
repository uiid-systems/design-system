import { Popover as BasePopover } from "@base-ui/react/popover";

import type { PopoverPortalProps } from "../popover.types";

export const PopoverPortal = ({ children, ...props }: PopoverPortalProps) => {
  return (
    <BasePopover.Portal data-slot="popover-portal" {...props}>
      {children}
    </BasePopover.Portal>
  );
};
PopoverPortal.displayName = "PopoverPortal";
