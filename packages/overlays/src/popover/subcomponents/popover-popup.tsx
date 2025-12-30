import { Popover as BasePopover } from "@base-ui/react/popover";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { PopoverPopupProps } from "../popover.types";
import styles from "../popover.module.css";

export const PopoverPopup = ({
  children,
  className,
  ...props
}: PopoverPopupProps) => {
  return (
    <BasePopover.Popup
      data-slot="popover-popup"
      render={<Card uiid="popover">{children}</Card>}
      className={cx(styles["popover-popup"], className)}
      data-is-popup
      {...props}
    >
      {children}
    </BasePopover.Popup>
  );
};
PopoverPopup.displayName = "PopoverPopup";
