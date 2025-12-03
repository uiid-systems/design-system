"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { isValidElement } from "react";

import { cx } from "@uiid/utils";
import { Card } from "@uiid/cards";

import type { ModalProps } from "./modal.types";
import styles from "./modal.module.css";

export const Modal = ({
  trigger,
  size = "md",
  title,
  open,
  onOpenChange,
  keepMounted,
  children,
  RootProps,
  TriggerProps,
  PopupProps,
}: ModalProps) => {
  const triggerIsEl = isValidElement(trigger);

  return (
    <Dialog.Root {...RootProps} open={open} onOpenChange={onOpenChange}>
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
          render={
            <Card uiid="modal" title={title}>
              {children}
            </Card>
          }
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
};
Modal.displayName = "Modal";
