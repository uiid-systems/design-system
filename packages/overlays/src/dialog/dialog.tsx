"use client";

import { hasTrigger } from "@uiid/utils";

import { DialogPendingProvider } from "./dialog-pending-context";
import type { DialogProps, DialogRootProps } from "./dialog.types";
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
  pending = false,
  size,
  title,
  description,
  action,
  footer,
  hideCloseButton,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  ViewportProps,
  PopupProps,
  trigger,
  children,
}: DialogProps) => {
  const handleOpenChange: DialogRootProps["onOpenChange"] = (
    nextOpen,
    eventDetails,
  ) => {
    if (!nextOpen && pending) {
      eventDetails.cancel();
      return;
    }
    RootProps?.onOpenChange?.(nextOpen, eventDetails);
    if (eventDetails.isCanceled) return;
    onOpenChange?.(nextOpen, eventDetails);
  };

  return (
    <DialogPendingProvider value={pending}>
      <DialogRoot open={open} {...RootProps} onOpenChange={handleOpenChange}>
        {hasTrigger(trigger, TriggerProps?.render) && (
          <DialogTrigger {...TriggerProps}>{trigger}</DialogTrigger>
        )}
        <DialogPortal {...PortalProps}>
          <DialogBackdrop {...BackdropProps} />
          <DialogViewport {...ViewportProps}>
            <DialogPopup
              size={size}
              title={title}
              description={description}
              action={action}
              footer={footer}
              hideCloseButton={hideCloseButton}
              {...PopupProps}
            >
              {children}
            </DialogPopup>
          </DialogViewport>
        </DialogPortal>
      </DialogRoot>
    </DialogPendingProvider>
  );
};
Dialog.displayName = "Dialog";
