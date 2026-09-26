"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { CardTitle } from "@uiid/cards";

import type { ToastTitleProps } from "../toast.types";

/** Reads `title` from the toast, and labels it for assistive tech. */
export const ToastTitle = (props: ToastTitleProps) => (
  <BaseToast.Title
    data-slot="toast-title"
    render={<CardTitle size={0} />}
    {...props}
  />
);
ToastTitle.displayName = "ToastTitle";
