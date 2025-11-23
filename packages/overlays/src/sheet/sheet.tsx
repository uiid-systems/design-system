"use client";

import { Dialog as SheetPrimitive } from "@base-ui-components/react/dialog";
import { isValidElement } from "react";

import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { SheetProps } from "./sheet.types";
import styles from "./sheet.module.css";

export const Sheet = ({
  trigger,
  title,
  side = "right",
  open,
  onOpenChange,
  keepMounted,
  children,
  RootProps,
  TriggerProps,
  PopupProps,
}: SheetProps) => {
  const triggerIsEl = isValidElement(trigger);

  return (
    <SheetPrimitive.Root {...RootProps} open={open} onOpenChange={onOpenChange}>
      <SheetPrimitive.Trigger
        {...TriggerProps}
        render={<div tabIndex={triggerIsEl ? -1 : 0} />}
        nativeButton={false}
      >
        {trigger}
      </SheetPrimitive.Trigger>

      <SheetPrimitive.Portal keepMounted={keepMounted}>
        <SheetPrimitive.Backdrop className={styles["sheet-backdrop"]} />
        <SheetPrimitive.Popup
          render={<Stack gap={4} />}
          className={cx(styles["sheet-popup"], PopupProps?.className)}
          data-side={side}
          {...PopupProps}
        >
          {title && <SheetPrimitive.Title>{title}</SheetPrimitive.Title>}
          {/* <SheetPrimitive.Description /> */}
          {children}
          <SheetPrimitive.Close className={styles["sheet-close"]}>
            close
          </SheetPrimitive.Close>
        </SheetPrimitive.Popup>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};
Sheet.displayName = "Sheet";
