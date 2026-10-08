"use client";

import { hasTrigger } from "@uiid/utils";

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
  );
};
Drawer.displayName = "Drawer";
