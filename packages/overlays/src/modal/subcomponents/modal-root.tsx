import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import type { ModalRootProps } from "../modal.types";

export const ModalRoot = ({ children, ...props }: ModalRootProps) => {
  return (
    <BaseDialog.Root data-slot="modal-root" {...props}>
      {children}
    </BaseDialog.Root>
  );
};
ModalRoot.displayName = "ModalRoot";
