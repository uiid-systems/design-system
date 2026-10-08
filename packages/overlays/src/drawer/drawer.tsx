"use client";

import type { DrawerProps } from "./drawer.types";
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
  // A drawer opened from elsewhere has no trigger. Without one, render no
  // Trigger part at all: Base UI's controlled Root doesn't need it, and the
  // empty focusable span the part would otherwise plant is a tab stop nobody
  // asked for. A caller's own `render` still counts as a trigger.
  return (
    <DrawerRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
      swipeDirection={swipeDirection}
      snapPoints={snapPoints}
      snapPoint={snapPoint}
      defaultSnapPoint={defaultSnapPoint}
      onSnapPointChange={onSnapPointChange}
      {...RootProps}
    >
      {(trigger != null || TriggerProps?.render) && (
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
  );
};
Drawer.displayName = "Drawer";
