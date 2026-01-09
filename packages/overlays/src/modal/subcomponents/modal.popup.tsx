import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import { modalVariants } from "../modal.variants";
import type { ModalPopupProps } from "../modal.types";
import styles from "../modal.module.css";

export const ModalPopup = ({
  size,
  className,
  children,
  ...props
}: ModalPopupProps) => {
  return (
    <BaseDialog.Popup
      data-slot="modal-popup"
      className={cx(styles["modal-popup"], modalVariants({ size }), className)}
      render={<Card>{children}</Card>}
      data-is-popup
      {...props}
    >
      {children}
    </BaseDialog.Popup>
  );
};
ModalPopup.displayName = "ModalPopup";
