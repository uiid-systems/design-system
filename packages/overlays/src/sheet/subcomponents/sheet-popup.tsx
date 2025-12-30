import { Dialog as BaseSheet } from "@base-ui/react/dialog";

import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { SheetPopupProps } from "../sheet.types";
import styles from "../sheet.module.css";

export const SheetPopup = ({
  side,
  className,
  children,
  ...props
}: SheetPopupProps) => {
  return (
    <BaseSheet.Popup
      render={<Stack gap={4} />}
      className={cx(styles["sheet-popup"], className)}
      data-side={side}
      {...props}
    >
      {/* <BaseSheet.Title /> */}
      {/* <BaseSheet.Description /> */}
      {/* <SheetClose /> */}
      {children}
    </BaseSheet.Popup>
  );
};
SheetPopup.displayName = "SheetPopup";
