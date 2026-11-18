"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";

import type { PopoverRootProps } from "../popover.types";

/** Groups all parts of the popover. Renders no element of its own. */
export const PopoverRoot = ({ children, ...props }: PopoverRootProps) => {
  return <BasePopover.Root {...props}>{children}</BasePopover.Root>;
};
PopoverRoot.displayName = "PopoverRoot";
