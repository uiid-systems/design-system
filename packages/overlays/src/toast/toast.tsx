"use client";

import { Toast as BaseToast } from "@base-ui-components/react/toast";

import { Card } from "@uiid/cards";
import { Text } from "@uiid/typography";

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
        <Card uiid="toast" title={toast.title!} size="sm">
          <Text level={0} shade="accent" render={<BaseToast.Description />} />
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

export const ToastProvider = BaseToast.Provider;
export const useToastManager = BaseToast.useToastManager;
