import { Toast as BaseToast } from "@base-ui-components/react/toast";

import { X } from "@uiid/icons";

import styles from "./toast.module.css";

export const ToastProvider = BaseToast.Provider;
export const useToastManager = BaseToast.useToastManager;

const ToastList = () => {
  const { toasts } = useToastManager();

  return toasts.map((toast) => (
    <BaseToast.Root key={toast.id} toast={toast} className={styles.Toast}>
      <BaseToast.Content className={styles.Content}>
        <BaseToast.Title className={styles.Title} />
        <BaseToast.Description className={styles.Description} />
        <BaseToast.Close className={styles.Close} aria-label="Close">
          <X size={16} />
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  ));
};
ToastList.displayName = "ToastList";

export const Toaster = () => {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className={styles.Viewport}>
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
};
Toaster.displayName = "Toaster";
