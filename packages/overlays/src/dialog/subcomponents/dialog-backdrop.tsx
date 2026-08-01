import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { cx } from "@uiid/utils";

import type { DialogBackdropProps } from "../dialog.types";
import styles from "../dialog.module.css";

export const DialogBackdrop = ({
  className,
  ...props
}: DialogBackdropProps) => {
  return (
    <BaseDialog.Backdrop
      data-slot="dialog-backdrop"
      className={cx(styles["dialog-backdrop"], className)}
      {...props}
    />
  );
};
DialogBackdrop.displayName = "DialogBackdrop";
