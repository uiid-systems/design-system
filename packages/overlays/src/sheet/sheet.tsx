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
  side = "right",
  title,
  description,
  icon,
  action,
  footer,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  PopupProps,
  trigger,
  open,
  onOpenChange,
  children,
}: SheetProps) => {
  return (
    <SheetRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
      <SheetTrigger {...TriggerProps}>
        {trigger ?? TriggerProps?.children}
      </SheetTrigger>

      <SheetPortal {...PortalProps}>
        <SheetBackdrop {...BackdropProps} />
        <SheetPopup
          side={side}
          title={title}
          description={description}
          icon={icon}
          action={action}
          footer={footer}
          {...PopupProps}
        >
          {children ?? PopupProps?.children}
        </SheetPopup>
      </SheetPortal>
    </SheetRoot>
  );
};
Sheet.displayName = "Sheet";
