"use client";

import { definedProps, hasTrigger } from "@uiid/utils";

import { composeOpenChange } from "../shared/compose-open-change";
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
  defaultOpen,
  onOpenChange,
  modal,
  title,
  description,
  action,
  footer,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  PositionerProps,
  PopupProps,
  children,
}: PopoverProps) => {
  return (
    <PopoverRoot
      {...RootProps}
      {...definedProps({ open, defaultOpen, modal })}
      onOpenChange={composeOpenChange(RootProps?.onOpenChange, onOpenChange)}
    >
      {hasTrigger(trigger, TriggerProps?.render) && (
        <PopoverTrigger {...TriggerProps}>{trigger}</PopoverTrigger>
      )}
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
