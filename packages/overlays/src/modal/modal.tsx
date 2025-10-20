import { Dialog } from "@base-ui-components/react/dialog";

import { Card } from "@uiid/cards";

import type { ModalProps } from "./modal.types";
import styles from "./modal.module.css";

export const Modal = ({
  trigger,
  title,
  open,
  onOpenChange,
  onDismiss,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  keepMounted,
  children,
  RootProps,
  TriggerProps,
  PopupProps,
}: ModalProps) => {
  const handleDismiss = () => {
    onDismiss?.();
  };

  return (
    <Dialog.Root {...RootProps} open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger {...TriggerProps}>{trigger}</Dialog.Trigger>

      <Dialog.Portal keepMounted={keepMounted}>
        <Dialog.Backdrop className={styles["modal-backdrop"]} />
        <Dialog.Popup className={styles["modal-popup"]} {...PopupProps}>
          <Card
            title={title}
            onDismiss={handleDismiss}
            renderDismissButton={<Dialog.Close />}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            tertiaryAction={tertiaryAction}
          >
            {children}
          </Card>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
Modal.displayName = "Modal";
