import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import type { SheetPortalProps } from "../sheet.types";

export const SheetPortal = ({ children, ...props }: SheetPortalProps) => {
  return (
    <BaseDialog.Portal data-slot="sheet-portal" {...props}>
      {children}
    </BaseDialog.Portal>
  );
};
SheetPortal.displayName = "SheetPortal";
