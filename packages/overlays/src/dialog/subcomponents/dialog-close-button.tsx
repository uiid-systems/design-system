"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Button } from "@uiid/buttons";
import { XIcon } from "@uiid/icons/x";

import { useDialogPending } from "../dialog-pending-context";

/**
 * The header close. It sits beside the title it would describe, so it's named
 * by `aria-label` alone and takes no `tooltip`.
 */
export const DialogCloseButton = () => {
  const pending = useDialogPending();

  return (
    <BaseDialog.Close
      data-slot="dialog-close-button"
      aria-label="Close"
      render={<Button variant="ghost" shape="square" disabled={pending} />}
    >
      <XIcon />
    </BaseDialog.Close>
  );
};
DialogCloseButton.displayName = "DialogCloseButton";
