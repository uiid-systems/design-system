import { Toast as BaseToast } from "@base-ui-components/react/toast";

import { X } from "@uiid/icons";
import { Card } from "@uiid/layout";
import { Text } from "@uiid/typography";

import type { ToastProps } from "./toast.types";
import styles from "./toast.module.css";

const ToastList = () => {
  const { toasts } = useToastManager();

  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      render={<Card gap={2} />}
      className={styles.Toast}
    >
      <BaseToast.Content className={styles.Content}>
        <BaseToast.Title render={<Text render={<h3 />} level={1} />} />
        <BaseToast.Description render={<Text render={<h4 />} level={0} />} />
        <BaseToast.Close className={styles.Close} aria-label="Close">
          <X size={16} />
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  ));
};
ToastList.displayName = "ToastList";

export const Toaster = ({ position = "bottom" }: ToastProps) => {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className={styles.Viewport} data-position={position}>
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
};
Toaster.displayName = "Toaster";

export const ToastProvider = BaseToast.Provider;
export const useToastManager = BaseToast.useToastManager;
