"use client";

import type { PopoverProps } from "./popover.types";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverBackdrop,
  PopoverPositioner,
  PopoverPopup,
} from "./subcomponents";

export const Popover = ({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  action,
  footer,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  PositionerProps = {
    sideOffset: 4,
    collisionPadding: 16,
  },
  PopupProps,
  children,
}: PopoverProps) => {
  return (
    <PopoverRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
      <PopoverTrigger {...TriggerProps}>{trigger}</PopoverTrigger>
      <PopoverPortal {...PortalProps}>
        <PopoverBackdrop {...BackdropProps} />
        <PopoverPositioner {...PositionerProps}>
          <PopoverPopup
            title={title}
            description={description}
            action={action}
            footer={footer}
            {...PopupProps}
          >
            {children}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </PopoverRoot>
  );
};
Popover.displayName = "Popover";
