"use client";

import type { DialogProps } from "./dialog.types";

import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
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
  PopupProps,
  trigger,
  children,
}: DialogProps) => {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
      <DialogTrigger {...TriggerProps}>{trigger}</DialogTrigger>
      <DialogPortal {...PortalProps}>
        <DialogBackdrop {...BackdropProps} />
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
      </DialogPortal>
    </DialogRoot>
  );
};
Dialog.displayName = "Dialog";
