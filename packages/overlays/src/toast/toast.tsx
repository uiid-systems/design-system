"use client";

import { LoadingSpinnerIcon } from "@uiid/icons/loading-spinner";
import { Group, Stack } from "@uiid/layout";

import {
  ToastPortal,
  ToastViewport,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from "./subcomponents";
import { TOAST_LOADING_TYPE } from "./toast.constants";
import { useToastManager } from "./toast.hooks";
import type { ToastObject, ToasterProps } from "./toast.types";

import styles from "./toast.module.css";

const ToastItem = ({ toast }: { toast: ToastObject }) => {
  const { children, color, closable } = toast.data ?? {};
  const loading = toast.type === TOAST_LOADING_TYPE;
  const showClose = closable ?? !loading;

  return (
    <ToastRoot toast={toast} color={color}>
      <ToastContent>
        <Group ay="start" gap={2} fullwidth>
          {loading && (
            <LoadingSpinnerIcon
              data-slot="toast-spinner"
              className={styles["toast-spinner"]}
            />
          )}
          <Stack gap={1} className={styles["toast-lockup"]}>
            {toast.title && <ToastTitle />}
            {toast.description && <ToastDescription />}
          </Stack>
          {showClose && <ToastClose />}
        </Group>
        {children}
        {toast.actionProps && (
          <Group ax="end" fullwidth>
            <ToastAction />
          </Group>
        )}
      </ToastContent>
    </ToastRoot>
  );
};

const ToastList = () => {
  const { toasts } = useToastManager();
  return toasts.map((toast) => <ToastItem key={toast.id} toast={toast} />);
};

export const Toaster = ({ position, ViewportProps }: ToasterProps) => (
  <ToastPortal>
    <ToastViewport position={position} {...ViewportProps}>
      <ToastList />
    </ToastViewport>
  </ToastPortal>
);
Toaster.displayName = "Toaster";
