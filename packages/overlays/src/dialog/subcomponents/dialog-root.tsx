"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import type { DialogRootProps } from "../dialog.types";

/** Groups all parts of the dialog. Renders no element of its own. */
export const DialogRoot = ({ children, ...props }: DialogRootProps) => {
  return <BaseDialog.Root {...props}>{children}</BaseDialog.Root>;
};
DialogRoot.displayName = "DialogRoot";
