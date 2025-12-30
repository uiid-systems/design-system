import { Popover as BasePopover } from "@base-ui/react/popover";

import type { PopoverRootProps } from "../popover.types";

export const PopoverRoot = ({ children, ...props }: PopoverRootProps) => {
  return (
    <BasePopover.Root data-slot="popover-root" {...props}>
      {children}
    </BasePopover.Root>
  );
};
PopoverRoot.displayName = "PopoverRoot";
