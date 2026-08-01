"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { Card } from "@uiid/cards";
import { Text } from "@uiid/typography";

import { useToastManager } from "./toast.hooks";
import type { ToasterProps } from "./toast.types";

import styles from "./toast.module.css";

const ToastList = () => {
  const { toasts } = useToastManager();

  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      className={styles["toast"]}
      render={
        <Card data-slot="toast">
          <Text size={0} shade="muted" render={<BaseToast.Description />} />
        </Card>
      }
    />
  ));
};
ToastList.displayName = "ToastList";

export const Toaster = ({ position = "bottom" }: ToasterProps) => {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        className={styles["toast-viewport"]}
        data-position={position}
      >
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
};
Toaster.displayName = "Toaster";
