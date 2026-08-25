import { Popover as BasePopover } from "@base-ui/react/popover";
import { cx } from "@uiid/utils";

import type { PopoverPositionerProps } from "../popover.types";

import styles from "../popover.module.css";

export const PopoverPositioner = ({
  children,
  className,
  ...props
}: PopoverPositionerProps) => {
  return (
    <BasePopover.Positioner
      data-slot="popover-positioner"
      className={cx(styles["popover-positioner"], className)}
      {...props}
    >
      {children}
    </BasePopover.Positioner>
  );
};
PopoverPositioner.displayName = "PopoverPositioner";
