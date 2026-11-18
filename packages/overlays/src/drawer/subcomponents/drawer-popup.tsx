"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { Card } from "@uiid/cards";
import { cxState, isRenderable } from "@uiid/utils";
import { useId } from "react";

import { useBodyOverflow } from "../../shared/use-body-overflow";
import type { DrawerPopupProps } from "../drawer.types";

import styles from "../drawer.module.css";

/**
 * The drawer surface. Rendered as a Card so the content slots match Dialog and
 * Popover, with Base UI's Title/Description composed into Card's own slots —
 * they register the ids the popup emits as aria-labelledby/aria-describedby.
 *
 * `children` is passed to the popup only, never duplicated into the render
 * element: Base UI forwards it into the Card.
 *
 * The body scrolls on its own (drawer.module.css). While it overflows it is a
 * tab stop, so the keyboard can scroll it, and a region named by the title.
 */
export const DrawerPopup = ({
  title,
  description,
  action,
  footer,
  className,
  children,
  ...props
}: DrawerPopupProps) => {
  // Base UI's Title takes this id, so the body can name itself after it.
  const titleId = useId();
  const bodyProps = useBodyOverflow(isRenderable(title) ? titleId : undefined);

  return (
    <BaseDrawer.Popup
      data-slot="drawer-popup"
      className={cxState(styles["drawer-popup"], className)}
      render={
        <Card
          title={title}
          description={description}
          action={action}
          footer={footer}
          shadow
          FooterProps={{ separator: true }}
          TitleProps={{ render: <BaseDrawer.Title id={titleId} /> }}
          DescriptionProps={{ render: <BaseDrawer.Description /> }}
          InnerContainerProps={bodyProps}
        />
      }
      {...props}
    >
      {children}
    </BaseDrawer.Popup>
  );
};
DrawerPopup.displayName = "DrawerPopup";
