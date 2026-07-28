import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { isValidElement } from "react";

import { cx } from "@uiid/utils";

import type { DialogTriggerProps } from "../dialog.types";
import styles from "../dialog.module.css";

export const DialogTrigger = ({
  children,
  className,
  ...props
}: DialogTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BaseDialog.Trigger
      data-slot="dialog-trigger"
      className={cx(styles["dialog-trigger"], className)}
      nativeButton={triggerIsEl}
      render={
        triggerIsEl ? (
          children
        ) : (
          <span role="button" tabIndex={0}>
            {children}
          </span>
        )
      }
      {...props}
    />
  );
};
DialogTrigger.displayName = "DialogTrigger";
