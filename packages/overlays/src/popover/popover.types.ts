import type { Popover as BasePopover } from "@base-ui/react/popover";
import type { CardProps } from "@uiid/cards";
import type { WithTriggerChildren } from "@uiid/utils";

type PopoverCardProps = Pick<
  CardProps,
  "title" | "description" | "action" | "icon" | "footer"
>;

export type PopoverRootProps = BasePopover.Root.Props;
export type PopoverTriggerProps = WithTriggerChildren<
  BasePopover.Trigger.Props,
  BasePopover.Trigger.State
>;
export type PopoverPortalProps = BasePopover.Portal.Props;
export type PopoverBackdropProps = BasePopover.Backdrop.Props;
export type PopoverPositionerProps = BasePopover.Positioner.Props;
export type PopoverPopupProps = Omit<BasePopover.Popup.Props, "title"> &
  PopoverCardProps;

export type PopoverProps = React.PropsWithChildren<{
  trigger?: PopoverTriggerProps["children"];
  RootProps?: PopoverRootProps;
  TriggerProps?: PopoverTriggerProps;
  PortalProps?: PopoverPortalProps;
  BackdropProps?: PopoverBackdropProps;
  PositionerProps?: BasePopover.Positioner.Props;
  PopupProps?: PopoverPopupProps;
}> &
  Partial<Pick<PopoverRootProps, "open" | "onOpenChange">> &
  PopoverCardProps;
