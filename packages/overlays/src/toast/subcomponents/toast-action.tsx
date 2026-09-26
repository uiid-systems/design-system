"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { Button } from "@uiid/buttons";

import type { ToastActionProps } from "../toast.types";

/**
 * Reads the toast's `actionProps`, label included, and renders nothing when it
 * has none.
 */
export const ToastAction = (props: ToastActionProps) => (
  <BaseToast.Action
    data-slot="toast-action"
    render={<Button size="small" variant="subtle" />}
    {...props}
  />
);
ToastAction.displayName = "ToastAction";
