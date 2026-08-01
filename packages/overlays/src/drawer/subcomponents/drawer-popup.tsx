"use client";

import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";
import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { DrawerPopupProps } from "../drawer.types";

import styles from "../drawer.module.css";

/**
 * The drawer surface. Rendered as a Card so the content slots match Dialog and
 * Popover, with Base UI's Title/Description composed into Card's own slots —
 * they register the ids the popup emits as aria-labelledby/aria-describedby.
 *
 * `children` is passed to the popup only, never duplicated into the render
 * element: Base UI forwards it into the Card.
 */
export const DrawerPopup = ({
  title,
  description,
  icon,
  action,
  footer,
  className,
  children,
  ...props
}: DrawerPopupProps) => {
  return (
    <BaseDrawer.Popup
      data-slot="drawer-popup"
      className={cx(styles["drawer-popup"], className)}
      render={
        <Card
          title={title}
          description={description}
          icon={icon}
          action={action}
          footer={footer}
          TitleProps={{ render: <BaseDrawer.Title /> }}
          DescriptionProps={{ render: <BaseDrawer.Description /> }}
        />
      }
      {...props}
    >
      {children}
    </BaseDrawer.Popup>
  );
};
DrawerPopup.displayName = "DrawerPopup";
