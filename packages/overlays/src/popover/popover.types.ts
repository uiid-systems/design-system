import type { Popover as BasePopover } from "@base-ui/react/popover";

import type { CardProps } from "@uiid/cards";

type PopoverCardProps = Pick<
  CardProps,
  "title" | "description" | "action" | "icon" | "footer"
>;

export type PopoverRootProps = BasePopover.Root.Props;
export type PopoverTriggerProps = BasePopover.Trigger.Props;
export type PopoverPortalProps = BasePopover.Portal.Props;
export type PopoverBackdropProps = BasePopover.Backdrop.Props;
export type PopoverPositionerProps = BasePopover.Positioner.Props;
export type PopoverPopupProps = BasePopover.Popup.Props & PopoverCardProps;

export type PopoverProps = React.PropsWithChildren<{
  trigger?: React.ReactNode;
  RootProps?: PopoverRootProps;
  TriggerProps?: PopoverTriggerProps;
  PortalProps?: PopoverPortalProps;
  BackdropProps?: PopoverBackdropProps;
  PositionerProps?: BasePopover.Positioner.Props;
  PopupProps?: PopoverPopupProps;
}> &
  Partial<Pick<PopoverRootProps, "open" | "onOpenChange">> &
  PopoverCardProps;
