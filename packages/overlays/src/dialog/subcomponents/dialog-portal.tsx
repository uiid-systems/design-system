import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import type { DialogPortalProps } from "../dialog.types";

export const DialogPortal = ({ children, ...props }: DialogPortalProps) => {
  return (
    <BaseDialog.Portal data-slot="dialog-portal" {...props}>
      {children}
    </BaseDialog.Portal>
  );
};
DialogPortal.displayName = "DialogPortal";
