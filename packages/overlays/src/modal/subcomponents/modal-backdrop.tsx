import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { cx } from "@uiid/utils";

import type { ModalBackdropProps } from "../modal.types";
import styles from "../modal.module.css";

export const ModalBackdrop = ({ className, ...props }: ModalBackdropProps) => {
  return (
    <BaseDialog.Backdrop
      data-slot="modal-backdrop"
      className={cx(styles["modal-backdrop"], className)}
      {...props}
    />
  );
};
ModalBackdrop.displayName = "ModalBackdrop";
