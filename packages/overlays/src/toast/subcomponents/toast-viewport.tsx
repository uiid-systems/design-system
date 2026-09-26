"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { cxState } from "@uiid/utils";

import { TOAST_DEFAULT_POSITION } from "../toast.constants";
import type { ToastViewportProps } from "../toast.types";

import styles from "../toast.module.css";

export const ToastViewport = ({
  position = TOAST_DEFAULT_POSITION,
  className,
  ...props
}: ToastViewportProps) => (
  <BaseToast.Viewport
    data-slot="toast-viewport"
    data-position={position}
    className={cxState(styles["toast-viewport"], className)}
    {...props}
  />
);
ToastViewport.displayName = "ToastViewport";
