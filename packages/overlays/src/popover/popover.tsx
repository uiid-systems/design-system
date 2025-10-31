import { Popover as BasePopover } from "@base-ui-components/react/popover";
import { isValidElement } from "react";

import { cx } from "@uiid/utils";
import { Card } from "@uiid/cards";

import styles from "./popover.module.css";
import type { PopoverProps } from "./popover.types";

export const Popover = ({
  trigger,
  title,
  onDismiss,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  children,
  RootProps,
  TriggerProps,
  PositionerProps = {
    sideOffset: 4,
    collisionPadding: 16,
  },
  PopupProps,
}: PopoverProps) => {
  const triggerIsEl = isValidElement(trigger);

  return (
    <BasePopover.Root {...RootProps}>
      <BasePopover.Trigger
        {...TriggerProps}
        render={<div tabIndex={triggerIsEl ? -1 : 0} />}
        nativeButton={false}
      >
        {trigger}
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Backdrop />
        <BasePopover.Positioner {...PositionerProps}>
          <BasePopover.Popup
            data-is-popup="true"
            className={cx(styles["popover-popup"], PopupProps?.className)}
            {...PopupProps}
            render={
              <Card
                uiid="popover"
                title={title}
                onDismiss={onDismiss}
                renderDismissButton={<BasePopover.Close />}
                primaryAction={primaryAction}
                secondaryAction={secondaryAction}
                tertiaryAction={tertiaryAction}
              >
                {children}
              </Card>
            }
          />
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
Popover.displayName = "Popover";
