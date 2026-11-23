"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Card } from "@uiid/cards";
import { cx, isRenderable } from "@uiid/utils";
import { useId } from "react";

import { useBodyOverflow } from "../../shared/use-body-overflow";
import type { DialogPopupProps } from "../dialog.types";
import { dialogVariants } from "../dialog.variants";
import { DialogCloseButton } from "./dialog-close-button";

import styles from "../dialog.module.css";

/**
 * The dialog surface. Rendered as a Card so the content slots match Drawer and
 * Popover, with Base UI's Title/Description composed into Card's own slots —
 * they register the ids the popup emits as aria-labelledby/aria-describedby.
 *
 * `children` is passed to the popup only, never duplicated into the render
 * element: Base UI forwards it into the Card.
 *
 * The close button rides in Card's action slot, after any `action` of the
 * caller's.
 *
 * The body scrolls on its own (dialog.module.css). While it overflows it is a
 * tab stop, so the keyboard can scroll it, and a region named by the title.
 */
export const DialogPopup = ({
  size,
  title,
  description,
  action,
  footer,
  hideCloseButton,
  className,
  children,
  ...props
}: DialogPopupProps) => {
  // Base UI's Title takes this id, so the body can name itself after it.
  const titleId = useId();
  const bodyProps = useBodyOverflow(isRenderable(title) ? titleId : undefined);

  return (
    <BaseDialog.Popup
      data-slot="dialog-popup"
      className={cx(
        styles["dialog-popup"],
        dialogVariants({ size }),
        className,
      )}
      render={
        <Card
          title={title}
          description={description}
          action={
            hideCloseButton ? (
              action
            ) : (
              <>
                {action}
                <DialogCloseButton />
              </>
            )
          }
          footer={footer}
          shadow
          FooterProps={{ separator: true }}
          TitleProps={{ render: <BaseDialog.Title id={titleId} /> }}
          DescriptionProps={{ render: <BaseDialog.Description /> }}
          InnerContainerProps={bodyProps}
        />
      }
      {...props}
    >
      {children}
    </BaseDialog.Popup>
  );
};
DialogPopup.displayName = "DialogPopup";
