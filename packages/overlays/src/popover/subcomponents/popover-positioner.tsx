import { Popover as BasePopover } from "@base-ui/react/popover";

import type { PopoverPositionerProps } from "../popover.types";

export const PopoverPositioner = ({
  children,
  ...props
}: PopoverPositionerProps) => {
  return (
    <BasePopover.Positioner data-slot="popover-positioner" {...props}>
      {children}
    </BasePopover.Positioner>
  );
};
PopoverPositioner.displayName = "PopoverPositioner";
