"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Button } from "@uiid/buttons";

import { useDialogPending } from "../dialog-pending-context";
import type { DialogCloseProps } from "../dialog.types";

export const DialogClose = ({
  children,
  disabled,
  ...props
}: DialogCloseProps) => {
  const pending = useDialogPending();

  return (
    <BaseDialog.Close
      data-slot="dialog-close"
      render={
        <Button variant="subtle" {...props} disabled={pending || disabled} />
      }
    >
      {children}
    </BaseDialog.Close>
  );
};
DialogClose.displayName = "DialogClose";
