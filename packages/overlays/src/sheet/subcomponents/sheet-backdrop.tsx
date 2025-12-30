import { Dialog as BaseSheet } from "@base-ui/react/dialog";

import { cx } from "@uiid/utils";

import type { SheetBackdropProps } from "../sheet.types";
import styles from "../sheet.module.css";

export const SheetBackdrop = ({ className, ...props }: SheetBackdropProps) => {
  return (
    <BaseSheet.Backdrop
      data-slot="sheet-backdrop"
      className={cx(styles["sheet-backdrop"], className)}
      {...props}
    />
  );
};
SheetBackdrop.displayName = "SheetBackdrop";
