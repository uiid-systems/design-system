import { Dialog as BaseSheet } from "@base-ui/react/dialog";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import { sheetVariants } from "../sheet.variants";

import type { SheetPopupProps } from "../sheet.types";
import styles from "../sheet.module.css";

export const SheetPopup = ({
  side,
  title,
  description,
  icon,
  action,
  footer,
  className,
  children,
  ...props
}: SheetPopupProps) => {
  return (
    <BaseSheet.Popup
      render={
        <Card
          gap={4}
          title={title}
          description={description}
          icon={icon}
          action={action}
          footer={footer}
          FooterProps={{ style: { marginTop: "auto" } }}
        />
      }
      className={cx(styles["sheet-popup"], sheetVariants({ side }), className)}
      {...props}
    >
      {children}
    </BaseSheet.Popup>
  );
};
SheetPopup.displayName = "SheetPopup";
