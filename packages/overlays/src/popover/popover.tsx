import { Popover as BasePopover } from "@base-ui-components/react/popover";

import { cx } from "@uiid/utils";
import { Card } from "@uiid/cards";

import type { PopoverProps } from "./popover.types";
import styles from "./popover.module.css";

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
  return (
    <BasePopover.Root {...RootProps}>
      <BasePopover.Trigger {...TriggerProps}>{trigger}</BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Backdrop />
        <BasePopover.Positioner {...PositionerProps}>
          <BasePopover.Popup
            data-is-popup="true"
            className={cx(styles["popover-popup"], PopupProps?.className)}
            {...PopupProps}
            render={
              <Card
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
