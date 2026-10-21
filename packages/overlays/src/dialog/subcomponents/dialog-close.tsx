"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Button } from "@uiid/buttons";

import type { DialogCloseProps } from "../dialog.types";

export const DialogClose = ({ children, ...props }: DialogCloseProps) => (
  <BaseDialog.Close
    data-slot="dialog-close"
    render={<Button variant="subtle" {...props} />}
  >
    {children}
  </BaseDialog.Close>
);
DialogClose.displayName = "DialogClose";
