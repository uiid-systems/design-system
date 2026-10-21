"use client";

import { LoadingSpinnerIcon } from "@uiid/icons/loading-spinner";
import { Group, Stack } from "@uiid/layout";
import { isRenderable } from "@uiid/utils";

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
import {
  TOAST_DEFAULT_POSITION,
  TOAST_LOADING_TYPE,
  TOAST_SWIPE_DIRECTIONS,
} from "./toast.constants";
import { useToastManager } from "./toast.hooks";
import type { ToastObject, ToastRootProps, ToasterProps } from "./toast.types";

import styles from "./toast.module.css";

type ToastItemProps = {
  toast: ToastObject;
  swipeDirection: ToastRootProps["swipeDirection"];
};

const ToastItem = ({ toast, swipeDirection }: ToastItemProps) => {
  const { children, color, closable } = toast.data ?? {};
  const loading = toast.type === TOAST_LOADING_TYPE;
  const showClose = closable ?? !loading;

  return (
    <ToastRoot toast={toast} color={color} swipeDirection={swipeDirection}>
      <ToastContent>
        <Group ay="center" gap={3} fullwidth>
          {loading && (
            <LoadingSpinnerIcon
              aria-hidden
              data-slot="toast-spinner"
              className={styles["toast-spinner"]}
            />
          )}
          <Stack gap={0.5} className={styles["toast-lockup"]}>
            {isRenderable(toast.title) && <ToastTitle />}
            {isRenderable(toast.description) && <ToastDescription />}
          </Stack>
          {toast.actionProps && <ToastAction />}
          {showClose && <ToastClose />}
        </Group>
        {children}
      </ToastContent>
    </ToastRoot>
  );
};

const ToastList = ({
  swipeDirection,
}: Pick<ToastItemProps, "swipeDirection">) => {
  const { toasts } = useToastManager();
  return toasts.map((toast) => (
    <ToastItem key={toast.id} toast={toast} swipeDirection={swipeDirection} />
  ));
};

export const Toaster = ({
  position = TOAST_DEFAULT_POSITION,
  ViewportProps,
}: ToasterProps) => (
  <ToastPortal>
    <ToastViewport position={position} {...ViewportProps}>
      <ToastList swipeDirection={TOAST_SWIPE_DIRECTIONS[position]} />
    </ToastViewport>
  </ToastPortal>
);
Toaster.displayName = "Toaster";
