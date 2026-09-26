"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { CardDescription } from "@uiid/cards";

import type { ToastDescriptionProps } from "../toast.types";

/** Reads `description` from the toast, and describes it for assistive tech. */
export const ToastDescription = (props: ToastDescriptionProps) => (
  <BaseToast.Description
    data-slot="toast-description"
    render={<CardDescription />}
    {...props}
  />
);
ToastDescription.displayName = "ToastDescription";
