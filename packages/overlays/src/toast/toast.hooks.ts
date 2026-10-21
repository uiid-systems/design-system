"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";

import type { ToastData } from "./toast.types";

type DefaultToastData = ToastData & Record<string, unknown>;

export const ToastProvider = BaseToast.Provider;

/**
 * Base UI's hook. By default `data` types the fields Toaster renders and
 * still accepts any other key, as Base UI's `any` default did; pass a type
 * argument to narrow it.
 */
export const useToastManager = <Data extends object = DefaultToastData>() =>
  BaseToast.useToastManager<Data>();

/**
 * Base UI's manager for firing toasts from outside React. Pass it to
 * `ToastProvider` as `toastManager`; it does nothing until a provider
 * subscribes. It has `add`, `update`, `close` and `promise` but no `toasts`;
 * read those through `useToastManager`. `data` is typed as in
 * `useToastManager`.
 */
export const createToastManager = <Data extends object = DefaultToastData>() =>
  BaseToast.createToastManager<Data>();
