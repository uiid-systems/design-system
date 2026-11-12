import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Card, type CardProps } from "@uiid/cards";
import { cxState } from "@uiid/utils";

import type { DialogPopupProps } from "../dialog.types";
import { dialogVariants } from "../dialog.variants";
import { DialogCloseButton } from "./dialog-close-button";

import styles from "../dialog.module.css";

const BODY_PROPS = { w: undefined } satisfies CardProps["InnerContainerProps"];

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
  return (
    <BaseDialog.Popup
      data-slot="dialog-popup"
      className={cxState(
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
          FooterProps={{ hideSeparator: false }}
          TitleProps={{ render: <BaseDialog.Title /> }}
          DescriptionProps={{ render: <BaseDialog.Description /> }}
          // The body stretches past the card's padding to its edges, which
          // a `w="full"` of the content box would stop short of.
          InnerContainerProps={BODY_PROPS}
        />
      }
      {...props}
    >
      {children}
    </BaseDialog.Popup>
  );
};
DialogPopup.displayName = "DialogPopup";
