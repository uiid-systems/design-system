"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";

import type { ToastPortalProps } from "../toast.types";

export const ToastPortal = (props: ToastPortalProps) => (
  <BaseToast.Portal data-slot="toast-portal" {...props} />
);
ToastPortal.displayName = "ToastPortal";
