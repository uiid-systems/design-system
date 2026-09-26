"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { Card } from "@uiid/cards";
import { cxState } from "@uiid/utils";

import type { ToastRootProps } from "../toast.types";

import styles from "../toast.module.css";

/**
 * The toast surface, rendered as a Card so it matches the other overlays. The
 * hue goes to Card, which owns the palette class; everything else is Base UI's.
 */
export const ToastRoot = ({ color, className, ...props }: ToastRootProps) => (
  <BaseToast.Root
    data-slot="toast"
    className={cxState(styles["toast"], className)}
    render={<Card color={color} />}
    {...props}
  />
);
ToastRoot.displayName = "ToastRoot";
