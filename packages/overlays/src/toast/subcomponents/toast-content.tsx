"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { Stack } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { ToastContentProps } from "../toast.types";

import styles from "../toast.module.css";

/**
 * Everything inside the surface. Collapsed toasts take the frontmost toast's
 * height, so a taller one behind it would spill out; Base UI marks those
 * `data-behind` and the CSS fades their content out.
 */
export const ToastContent = ({ className, ...props }: ToastContentProps) => (
  <BaseToast.Content
    data-slot="toast-content"
    className={cxState(styles["toast-content"], className)}
    render={<Stack gap={3} fullwidth />}
    {...props}
  />
);
ToastContent.displayName = "ToastContent";
