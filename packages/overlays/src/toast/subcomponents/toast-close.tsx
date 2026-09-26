"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { Button } from "@uiid/buttons";
import { XIcon } from "@uiid/icons/x";
import { cxState } from "@uiid/utils";

import type { ToastCloseProps } from "../toast.types";

import styles from "../toast.module.css";

export const ToastClose = ({
  className,
  children,
  ...props
}: ToastCloseProps) => (
  <BaseToast.Close
    data-slot="toast-close"
    aria-label="Close"
    className={cxState(styles["toast-close"], className)}
    render={<Button size="xsmall" variant="ghost" shape="circle" />}
    {...props}
  >
    {children ?? <XIcon size={14} />}
  </BaseToast.Close>
);
ToastClose.displayName = "ToastClose";
