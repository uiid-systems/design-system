import { Dialog as BaseSheet } from "@base-ui/react/dialog";

import type { SheetCloseProps } from "../sheet.types";

export const SheetClose = ({ children, ...props }: SheetCloseProps) => {
  return (
    <BaseSheet.Close data-slot="sheet-close" {...props}>
      {children}
    </BaseSheet.Close>
  );
};
SheetClose.displayName = "SheetClose";
