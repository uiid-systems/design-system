import { Dialog } from "@base-ui-components/react/dialog";

import type { ModalProps } from "./modal.types";
import styles from "./modal.module.css";

export const Modal = ({
  title,
  description,
  children,
  RootProps,
  PortalProps,
  BackdropProps,
  PopupProps,
  TitleProps,
  DescriptionProps,
  CloseProps,
}: ModalProps) => {
  return (
    <Dialog.Root {...RootProps}>
      <Dialog.Trigger>View notifications</Dialog.Trigger>

      <Dialog.Portal {...PortalProps}>
        <Dialog.Backdrop
          className={styles["modal-backdrop"]}
          {...BackdropProps}
        />
        <Dialog.Popup className={styles["modal-popup"]} {...PopupProps}>
          <Dialog.Title className={styles["modal-title"]} {...TitleProps}>
            {title}
          </Dialog.Title>

          <Dialog.Description
            className={styles["modal-description"]}
            {...DescriptionProps}
          >
            {description}
          </Dialog.Description>

          {children}

          <Dialog.Close className={styles["modal-close"]} {...CloseProps}>
            Close
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
Modal.displayName = "Modal";
