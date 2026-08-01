"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cx } from "@uiid/utils";

import type { DialogViewportProps } from "../dialog.types";

import styles from "../dialog.module.css";

/**
 * Positioning container for the popup. Centering lives here rather than on the
 * popup, which renders as a Card — keeping the two off the same element means
 * Card's surface styles and the dialog's placement never compete in the
 * cascade.
 */
export const DialogViewport = ({
  className,
  children,
  ...props
}: DialogViewportProps) => {
  return (
    <BaseDialog.Viewport
      data-slot="dialog-viewport"
      className={cx(styles["dialog-viewport"], className)}
      {...props}
    >
      {children}
    </BaseDialog.Viewport>
  );
};
DialogViewport.displayName = "DialogViewport";
