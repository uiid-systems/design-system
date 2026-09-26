"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { CardDescription } from "@uiid/cards";
import { cxState } from "@uiid/utils";

import type { ToastDescriptionProps } from "../toast.types";

import styles from "../toast.module.css";

/** Reads `description` from the toast, and describes it for assistive tech. */
export const ToastDescription = ({
  className,
  ...props
}: ToastDescriptionProps) => (
  <BaseToast.Description
    data-slot="toast-description"
    className={cxState(styles["toast-description"], className)}
    render={<CardDescription />}
    {...props}
  />
);
ToastDescription.displayName = "ToastDescription";
