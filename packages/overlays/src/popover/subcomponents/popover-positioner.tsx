"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { cxState } from "@uiid/utils";

import {
  POPOVER_DEFAULT_COLLISION_PADDING,
  POPOVER_DEFAULT_SIDE_OFFSET,
} from "../popover.constants";
import type { PopoverPositionerProps } from "../popover.types";

import styles from "../popover.module.css";

export const PopoverPositioner = ({
  sideOffset = POPOVER_DEFAULT_SIDE_OFFSET,
  collisionPadding = POPOVER_DEFAULT_COLLISION_PADDING,
  children,
  className,
  ...props
}: PopoverPositionerProps) => {
  return (
    <BasePopover.Positioner
      data-slot="popover-positioner"
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cxState(styles["popover-positioner"], className)}
      {...props}
    >
      {children}
    </BasePopover.Positioner>
  );
};
PopoverPositioner.displayName = "PopoverPositioner";
