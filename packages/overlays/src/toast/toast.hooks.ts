"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";

import type { ToastData } from "./toast.types";

export const ToastProvider = BaseToast.Provider;

/**
 * Base UI's hook, with `data` typed as the fields Toaster renders. Still
 * generic, so an app can extend `ToastData` with its own fields.
 */
export const useToastManager = <Data extends ToastData = ToastData>() =>
  BaseToast.useToastManager<Data>();
