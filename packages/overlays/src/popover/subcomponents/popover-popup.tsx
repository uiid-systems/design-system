import { Popover as BasePopover } from "@base-ui/react/popover";
import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { PopoverPopupProps } from "../popover.types";

import styles from "../popover.module.css";

/**
 * The popover surface. Rendered as a Card so the content slots match Dialog and
 * Drawer, with Base UI's Title/Description composed into Card's own slots —
 * they register the ids the popup emits as aria-labelledby/aria-describedby.
 *
 * `children` is passed to the popup only, never duplicated into the render
 * element: Base UI forwards it into the Card.
 */
export const PopoverPopup = ({
  title,
  description,
  icon,
  action,
  footer,
  children,
  className,
  ...props
}: PopoverPopupProps) => {
  return (
    <BasePopover.Popup
      data-slot="popover-popup"
      render={
        <Card
          title={title}
          description={description}
          icon={icon}
          action={action}
          footer={footer}
          TitleProps={{ render: <BasePopover.Title /> }}
          DescriptionProps={{ render: <BasePopover.Description /> }}
        />
      }
      className={cx(styles["popover-popup"], className)}
      {...props}
    >
      {children}
    </BasePopover.Popup>
  );
};
PopoverPopup.displayName = "PopoverPopup";
