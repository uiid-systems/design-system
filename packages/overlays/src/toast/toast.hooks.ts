"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";

import type { ToastData } from "./toast.types";

export const ToastProvider = BaseToast.Provider;

/**
 * Base UI's hook. By default `data` types the fields Toaster renders and
 * still accepts any other key, as Base UI's `any` default did; pass a type
 * argument to narrow it.
 */
export const useToastManager = <
  Data extends object = ToastData & Record<string, unknown>,
>() => BaseToast.useToastManager<Data>();
