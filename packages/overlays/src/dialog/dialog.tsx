"use client";

import type { DialogProps } from "./dialog.types";

import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
} from "./subcomponents";

export const Dialog = ({
  open,
  onOpenChange,
  size,
  title,
  description,
  icon,
  action,
  footer,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  ViewportProps,
  PopupProps,
  trigger,
  children,
}: DialogProps) => {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
      <DialogTrigger {...TriggerProps}>{trigger}</DialogTrigger>
      <DialogPortal {...PortalProps}>
        <DialogBackdrop {...BackdropProps} />
        <DialogViewport {...ViewportProps}>
          <DialogPopup
            size={size}
            title={title}
            description={description}
            icon={icon}
            action={action}
            footer={footer}
            {...PopupProps}
          >
            {children}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  );
};
Dialog.displayName = "Dialog";
