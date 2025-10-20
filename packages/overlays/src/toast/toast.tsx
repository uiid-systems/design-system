import { Toast as BaseToast } from "@base-ui-components/react/toast";

import { Card } from "@uiid/cards";

import type { ToastProps } from "./toast.types";
import styles from "./toast.module.css";

const ToastList = () => {
  const { toasts } = useToastManager();

  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      className={styles["toast"]}
      render={
        <Card title={toast.title} renderDismissButton={<BaseToast.Close />}>
          <BaseToast.Description />
        </Card>
      }
    />
  ));
};
ToastList.displayName = "ToastList";

export const Toaster = ({ position = "bottom" }: ToastProps) => {
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
