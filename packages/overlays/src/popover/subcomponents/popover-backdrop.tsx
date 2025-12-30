import { Popover as BasePopover } from "@base-ui/react/popover";

import type { PopoverBackdropProps } from "../popover.types";

export const PopoverBackdrop = ({ ...props }: PopoverBackdropProps) => {
  return <BasePopover.Backdrop data-slot="popover-backdrop" {...props} />;
};
PopoverBackdrop.displayName = "PopoverBackdrop";
