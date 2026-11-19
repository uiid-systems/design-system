"use client";

import { definedProps, hasTrigger } from "@uiid/utils";

import { composeOpenChange } from "../shared/compose-open-change";
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
  hideCloseButton,
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
    composeOpenChange(RootProps?.onOpenChange, onOpenChange)(
      nextOpen,
      eventDetails,
    );
  };

  return (
    <DrawerPendingProvider value={pending}>
      <DrawerRoot
        {...RootProps}
        {...definedProps({
          open,
          defaultOpen,
          modal,
          swipeDirection,
          snapPoints,
          snapPoint,
          defaultSnapPoint,
          onSnapPointChange,
        })}
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
              hideCloseButton={hideCloseButton}
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
