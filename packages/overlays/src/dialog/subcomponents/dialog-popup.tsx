import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import { dialogVariants } from "../dialog.variants";
import type { DialogPopupProps } from "../dialog.types";
import styles from "../dialog.module.css";

/**
 * The dialog surface. Rendered as a Card so the content slots match Drawer and
 * Popover, with Base UI's Title/Description composed into Card's own slots —
 * they register the ids the popup emits as aria-labelledby/aria-describedby.
 *
 * `children` is passed to the popup only, never duplicated into the render
 * element: Base UI forwards it into the Card.
 */
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
          TitleProps={{ render: <BaseDialog.Title /> }}
          DescriptionProps={{ render: <BaseDialog.Description /> }}
        />
      }
      {...props}
    >
      {children}
    </BaseDialog.Popup>
  );
};
DialogPopup.displayName = "DialogPopup";
