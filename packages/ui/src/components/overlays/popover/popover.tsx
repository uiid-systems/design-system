import { Popover as BasePopover } from "@base-ui-components/react/popover";

import { Stack, Text } from "@uiid/primitives";

import type { PopoverProps } from "./popover.types";
import styles from "./popover.module.css";

export const Popover = ({
  trigger,
  title,
  description,
  children,
  RootProps,
  TriggerProps,
  BackdropProps,
  PortalProps,
  PositionerProps = {
    sideOffset: 4,
    collisionPadding: 16,
  },
  PopupProps,
  TitleProps,
  DescriptionProps,
  CloseProps,
}: PopoverProps) => {
  return (
    <BasePopover.Root {...RootProps}>
      <BasePopover.Trigger {...TriggerProps}>{trigger}</BasePopover.Trigger>
      <BasePopover.Portal {...PortalProps}>
        <BasePopover.Backdrop {...BackdropProps} />
        <BasePopover.Positioner {...PositionerProps}>
          <BasePopover.Popup
            render={<Stack gap={4} />}
            className={styles["popover-popup"]}
            {...PopupProps}
          >
            <BasePopover.Title
              {...TitleProps}
              render={<Text render={<h3 />} level={1} />}
            >
              {title}
            </BasePopover.Title>
            <BasePopover.Description
              render={<Text render={<h4 />} level={0} />}
              {...DescriptionProps}
            >
              {description}
            </BasePopover.Description>
            {children}
            <BasePopover.Close {...CloseProps}>Close</BasePopover.Close>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
Popover.displayName = "Popover";
