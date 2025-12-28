"use client";

import { Dialog } from "@base-ui/react/dialog";
import { isValidElement, useState } from "react";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { ModalProps } from "./modal.types";
import styles from "./modal.module.css";

export const Modal = ({
  trigger,
  size = "md",
  open,
  onOpenChange,
  keepMounted,
  children,
  RootProps,
  TriggerProps,
  PopupProps,
}: ModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const triggerIsEl = isValidElement(trigger);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <Dialog.Root {...RootProps} open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        {...TriggerProps}
        render={<div tabIndex={triggerIsEl ? -1 : 0} />}
        nativeButton={false}
      >
        {trigger}
      </Dialog.Trigger>

      <Dialog.Portal keepMounted={keepMounted}>
        <Dialog.Backdrop className={styles["modal-backdrop"]} />
        <Dialog.Popup
          data-size={size}
          className={cx(styles["modal-popup"], PopupProps?.className)}
          {...PopupProps}
          render={<Card uiid="modal">{children}</Card>}
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
};
Modal.displayName = "Modal";
