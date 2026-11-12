"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { Card } from "@uiid/cards";
import { cxState } from "@uiid/utils";

import type { ToastRootProps } from "../toast.types";

import styles from "../toast.module.css";

/**
 * The root places and animates the toast; the `Card` inside it is the surface
 * and takes the hue. Keeping them on separate elements means Card's own
 * `position` and padding never compete with the stacking styles in the
 * cascade.
 */
export const ToastRoot = ({
  color,
  className,
  children,
  ...props
}: ToastRootProps) => (
  <BaseToast.Root
    data-slot="toast"
    className={cxState(styles["toast"], className)}
    {...props}
  >
    <Card color={color} w="full" py={3} className={styles["toast-surface"]}>
      {children}
    </Card>
  </BaseToast.Root>
);
ToastRoot.displayName = "ToastRoot";
