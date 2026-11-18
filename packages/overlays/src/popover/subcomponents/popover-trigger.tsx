import { Popover as BasePopover } from "@base-ui/react/popover";
import { cxState, resolveTrigger } from "@uiid/utils";

import type { PopoverTriggerProps } from "../popover.types";

import styles from "../popover.module.css";

export const PopoverTrigger = ({
  children,
  className,
  render,
  nativeButton,
  ...props
}: PopoverTriggerProps) => {
  const resolved = resolveTrigger(children, render);

  return (
    <BasePopover.Trigger
      data-slot="popover-trigger"
      className={cxState(styles["popover-trigger"], className)}
      {...props}
      render={render ?? resolved.render}
      nativeButton={nativeButton ?? resolved.nativeButton}
    >
      {resolved.children}
    </BasePopover.Trigger>
  );
};
PopoverTrigger.displayName = "PopoverTrigger";
