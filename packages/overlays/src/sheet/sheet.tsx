"use client";

import type { SheetProps } from "./sheet.types";

import {
  SheetRoot,
  SheetTrigger,
  SheetPortal,
  SheetBackdrop,
  SheetPopup,
} from "./subcomponents";

export const Sheet = ({
  /** variants */
  side = "right",
  /** subcomponents */
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  PopupProps,
  /** misc */
  trigger,
  open,
  onOpenChange,
  children,
}: SheetProps) => {
  return (
    <SheetRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
      <SheetTrigger {...TriggerProps}>{trigger}</SheetTrigger>

      <SheetPortal {...PortalProps}>
        <SheetBackdrop {...BackdropProps} />
        <SheetPopup side={side} {...PopupProps}>
          {children}
        </SheetPopup>
      </SheetPortal>
    </SheetRoot>
  );
};
Sheet.displayName = "Sheet";
