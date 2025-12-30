import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { isValidElement } from "react";

import type { ModalTriggerProps } from "../modal.types";

export const ModalTrigger = ({ children, ...props }: ModalTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BaseDialog.Trigger
      data-slot="modal-trigger"
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
