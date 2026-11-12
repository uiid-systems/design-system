"use client";

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
  TOAST_TYPES,
  isToastType,
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
  const { icon: Icon, color: typeColor } = isToastType(toast.type)
    ? TOAST_TYPES[toast.type]
    : {};
  const showClose = closable ?? toast.type !== TOAST_LOADING_TYPE;

  return (
    <ToastRoot
      toast={toast}
      color={color ?? typeColor}
      swipeDirection={swipeDirection}
    >
      <ToastContent>
        <Group ay="start" gap={3} w="full">
          {Icon && (
            <Group
              aria-hidden
              data-slot="toast-icon"
              ay="center"
              className={styles["toast-first-line"]}
            >
              <Icon />
            </Group>
          )}
          <Stack gap={0.5} className={styles["toast-lockup"]}>
            {isRenderable(toast.title) && <ToastTitle />}
            {isRenderable(toast.description) && <ToastDescription />}
          </Stack>
          {toast.actionProps && (
            <Group ay="center" className={styles["toast-first-line"]}>
              <ToastAction />
            </Group>
          )}
          {showClose && (
            <Group ay="center" className={styles["toast-first-line"]}>
              <ToastClose />
            </Group>
          )}
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
