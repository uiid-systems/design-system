import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { isValidElement } from "react";

import type { SheetTriggerProps } from "../sheet.types";

export const SheetTrigger = ({ children, ...props }: SheetTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BaseDialog.Trigger
      data-slot="sheet-trigger"
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
    >
      {children}
    </BaseDialog.Trigger>
  );
};
SheetTrigger.displayName = "SheetTrigger";
