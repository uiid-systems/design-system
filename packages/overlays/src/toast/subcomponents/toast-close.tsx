"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { Button } from "@uiid/buttons";
import { XIcon } from "@uiid/icons/x";

import type { ToastCloseProps } from "../toast.types";

export const ToastClose = ({ children, ...props }: ToastCloseProps) => (
  <BaseToast.Close
    data-slot="toast-close"
    aria-label="Close"
    render={<Button size="xsmall" variant="ghost" shape="square" />}
    {...props}
  >
    {children ?? <XIcon size={14} />}
  </BaseToast.Close>
);
ToastClose.displayName = "ToastClose";
