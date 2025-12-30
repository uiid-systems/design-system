import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import type { SheetRootProps } from "../sheet.types";

export const SheetRoot = ({ children, ...props }: SheetRootProps) => {
  return (
    <BaseDialog.Root data-slot="sheet-root" {...props}>
      {children}
    </BaseDialog.Root>
  );
};
SheetRoot.displayName = "SheetRoot";
