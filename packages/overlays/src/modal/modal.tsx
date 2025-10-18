import { Dialog } from "@base-ui-components/react/dialog";

import { Card } from "@uiid/cards";
import { Text } from "@uiid/typography";

import type { ModalProps } from "./modal.types";
import styles from "./modal.module.css";

export const Modal = ({
  trigger,
  title,
  description,
  children,
  RootProps,
  PortalProps,
  BackdropProps,
  TriggerProps,
  PopupProps,
  TitleProps,
  DescriptionProps,
  CloseProps,
}: ModalProps) => {
  return (
    <Dialog.Root {...RootProps}>
      <Dialog.Trigger {...TriggerProps}>{trigger}</Dialog.Trigger>

      <Dialog.Portal {...PortalProps}>
        <Dialog.Backdrop
          className={styles["modal-backdrop"]}
          {...BackdropProps}
        />
        <Dialog.Popup
          render={<Card gap={2} />}
          className={styles["modal-popup"]}
          {...PopupProps}
        >
          <Dialog.Title
            render={<Text render={<h3 />} level={1} />}
            {...TitleProps}
          >
            {title}
          </Dialog.Title>

          <Dialog.Description
            render={<Text render={<h4 />} level={0} />}
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
