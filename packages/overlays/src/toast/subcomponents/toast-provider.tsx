"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";

import type { ToastProviderProps } from "../toast.types";

/** Holds the toast queue. Mount it once, above the `Toaster` and every caller of `useToastManager`. */
export const ToastProvider = (props: ToastProviderProps) => (
  <BaseToast.Provider {...props} />
);
ToastProvider.displayName = "ToastProvider";
