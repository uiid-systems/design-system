import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import type { ModalPortalProps } from "../modal.types";

export const ModalPortal = ({ children, ...props }: ModalPortalProps) => {
  return (
    <BaseDialog.Portal data-slot="modal-portal" {...props}>
      {children}
    </BaseDialog.Portal>
  );
};
ModalPortal.displayName = "ModalPortal";
