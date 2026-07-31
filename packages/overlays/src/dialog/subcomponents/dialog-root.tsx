import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import type { DialogRootProps } from "../dialog.types";

export const DialogRoot = ({ children, ...props }: DialogRootProps) => {
  return (
    <BaseDialog.Root data-slot="dialog-root" {...props}>
      {children}
    </BaseDialog.Root>
  );
};
DialogRoot.displayName = "DialogRoot";
