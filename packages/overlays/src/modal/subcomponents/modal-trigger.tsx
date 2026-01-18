import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { isValidElement } from "react";

import { cx } from "@uiid/utils";

import type { ModalTriggerProps } from "../modal.types";
import styles from "../modal.module.css";

export const ModalTrigger = ({
  children,
  className,
  ...props
}: ModalTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BaseDialog.Trigger
      data-slot="modal-trigger"
      className={cx(styles["modal-trigger"], className)}
      nativeButton={triggerIsEl}
      render={
        triggerIsEl ? (
          children
        ) : (
          <span role="button" tabIndex={0}>
            {children}
          </span>
        )
      }
      {...props}
    />
  );
};
ModalTrigger.displayName = "ModalTrigger";
