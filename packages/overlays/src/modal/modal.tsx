"use client";

import type { ModalProps } from "./modal.types";

import {
  ModalRoot,
  ModalTrigger,
  ModalPortal,
  ModalBackdrop,
  ModalPopup,
} from "./subcomponents";

export const Modal = ({
  open,
  onOpenChange,
  size,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  PopupProps,
  trigger,
  children,
}: ModalProps) => {
  return (
    <ModalRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
      <ModalTrigger {...TriggerProps}>{trigger}</ModalTrigger>
      <ModalPortal {...PortalProps}>
        <ModalBackdrop {...BackdropProps} />
        <ModalPopup size={size} {...PopupProps}>
          {children}
        </ModalPopup>
      </ModalPortal>
    </ModalRoot>
  );
};
Modal.displayName = "Modal";
