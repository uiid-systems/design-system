"use client";

import { hasTrigger } from "@uiid/utils";

import { DrawerPendingProvider } from "./drawer-pending-context";
import type { DrawerProps, DrawerRootProps } from "./drawer.types";
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerViewport,
  DrawerPopup,
  DrawerContent,
} from "./subcomponents";

export const Drawer = ({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  pending = false,
  modal,
  swipeDirection,
  snapPoints,
  snapPoint,
  defaultSnapPoint,
  onSnapPointChange,
  title,
  description,
  action,
  footer,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  ViewportProps,
  PopupProps,
  ContentProps,
  children,
}: DrawerProps) => {
  const handleOpenChange: DrawerRootProps["onOpenChange"] = (
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
    <DrawerPendingProvider value={pending}>
      <DrawerRoot
        open={open}
        defaultOpen={defaultOpen}
        modal={modal}
        swipeDirection={swipeDirection}
        snapPoints={snapPoints}
        snapPoint={snapPoint}
        defaultSnapPoint={defaultSnapPoint}
        onSnapPointChange={onSnapPointChange}
        {...RootProps}
        onOpenChange={handleOpenChange}
      >
        {hasTrigger(trigger, TriggerProps?.render) && (
          <DrawerTrigger {...TriggerProps}>{trigger}</DrawerTrigger>
        )}
        <DrawerPortal {...PortalProps}>
          <DrawerBackdrop {...BackdropProps} />
          <DrawerViewport {...ViewportProps}>
            <DrawerPopup
              title={title}
              description={description}
              action={action}
              footer={footer}
              {...PopupProps}
            >
              <DrawerContent {...ContentProps}>{children}</DrawerContent>
            </DrawerPopup>
          </DrawerViewport>
        </DrawerPortal>
      </DrawerRoot>
    </DrawerPendingProvider>
  );
};
Drawer.displayName = "Drawer";
