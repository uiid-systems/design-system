"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cx, resolveTrigger } from "@uiid/utils";

import type { DialogTriggerProps } from "../dialog.types";

import styles from "../dialog.module.css";

export const DialogTrigger = ({
  children,
  className,
  render,
  nativeButton,
  ...props
}: DialogTriggerProps) => {
  const resolved = resolveTrigger(children, render);

  return (
    <BaseDialog.Trigger
      data-slot="dialog-trigger"
      className={cx(styles["dialog-trigger"], className)}
      {...props}
      render={render ?? resolved.render}
      nativeButton={nativeButton ?? resolved.nativeButton}
    >
      {resolved.children}
    </BaseDialog.Trigger>
  );
};
DialogTrigger.displayName = "DialogTrigger";
