import { Popover as BasePopover } from "@base-ui/react/popover";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { PopoverPopupProps } from "../popover.types";
import styles from "../popover.module.css";

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
        >
          {children}
        </Card>
      }
      className={cx(styles["popover-popup"], className)}
      data-is-popup
      {...props}
    >
      {children}
    </BasePopover.Popup>
  );
};
PopoverPopup.displayName = "PopoverPopup";
