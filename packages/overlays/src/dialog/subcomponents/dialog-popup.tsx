import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import { dialogVariants } from "../dialog.variants";
import type { DialogPopupProps } from "../dialog.types";
import styles from "../dialog.module.css";

export const DialogPopup = ({
  size,
  title,
  description,
  icon,
  action,
  footer,
  className,
  children,
  ...props
}: DialogPopupProps) => {
  return (
    <BaseDialog.Popup
      data-slot="dialog-popup"
      className={cx(styles["dialog-popup"], dialogVariants({ size }), className)}
      render={
        <Card
          title={title}
          description={description}
          icon={icon}
          action={action}
          footer={footer}
        >
          {children}
        </Card>
      }
      {...props}
    >
      {children}
    </BaseDialog.Popup>
  );
};
DialogPopup.displayName = "DialogPopup";
