"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { Card, type CardProps } from "@uiid/cards";
import { cxState } from "@uiid/utils";

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
 * keyboard can scroll it.
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
  const { ref: bodyRef, overflows } = useBodyOverflow();

  const bodyProps: CardProps["InnerContainerProps"] = {
    // The body stretches past the card's padding to its edges, which Card's
    // `w="full"` of the content box would stop short of.
    w: undefined,
    ref: bodyRef,
    ...(overflows && { tabIndex: 0 }),
  };

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
          TitleProps={{ render: <BasePopover.Title /> }}
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
