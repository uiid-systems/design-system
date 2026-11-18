"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { Card } from "@uiid/cards";
import { cxState, isRenderable } from "@uiid/utils";
import { useId } from "react";

import { useBodyOverflow } from "../../shared/use-body-overflow";
import type { PopoverPopupProps } from "../popover.types";

import styles from "../popover.module.css";

/**
 * The popover surface. Rendered as a Card so the content slots match Dialog and
 * Drawer, with Base UI's Title/Description composed into Card's own slots —
 * they register the ids the popup emits as aria-labelledby/aria-describedby.
 *
 * `children` is passed to the popup only, never duplicated into the render
 * element: Base UI forwards it into the Card.
 *
 * The popup is capped at the height beside the trigger and the body scrolls
 * on its own (popover.module.css). While it overflows it is a tab stop, so the
 * keyboard can scroll it, and a region named by the title.
 */
export const PopoverPopup = ({
  title,
  description,
  action,
  footer,
  children,
  className,
  ...props
}: PopoverPopupProps) => {
  // Base UI's Title takes this id, so the body can name itself after it.
  const titleId = useId();
  const bodyProps = useBodyOverflow(isRenderable(title) ? titleId : undefined);

  return (
    <BasePopover.Popup
      data-slot="popover-popup"
      render={
        <Card
          title={title}
          description={description}
          action={action}
          footer={footer}
          shadow
          FooterProps={{ hideSeparator: false }}
          TitleProps={{ render: <BasePopover.Title id={titleId} /> }}
          DescriptionProps={{ render: <BasePopover.Description /> }}
          InnerContainerProps={bodyProps}
        />
      }
      className={cxState(styles["popover-popup"], className)}
      {...props}
    >
      {children}
    </BasePopover.Popup>
  );
};
PopoverPopup.displayName = "PopoverPopup";
