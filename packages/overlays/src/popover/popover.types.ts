import type { Popover as BasePopover } from "@base-ui/react/popover";
import type { CardProps } from "@uiid/cards";
import type { WithStringClassName, WithTriggerChildren } from "@uiid/utils";

type PopoverCardProps = Pick<
  CardProps,
  "title" | "description" | "action" | "footer"
>;

export type PopoverRootProps = BasePopover.Root.Props;
export type PopoverTriggerProps = WithTriggerChildren<
  WithStringClassName<BasePopover.Trigger.Props>,
  BasePopover.Trigger.State
>;
export type PopoverPortalProps = BasePopover.Portal.Props;
export type PopoverBackdropProps = BasePopover.Backdrop.Props;
export type PopoverPositionerProps =
  WithStringClassName<BasePopover.Positioner.Props>;
export type PopoverPopupProps = Omit<
  WithStringClassName<BasePopover.Popup.Props>,
  "title"
> &
  PopoverCardProps;

export type PopoverProps = React.PropsWithChildren<{
  trigger?: PopoverTriggerProps["children"];
  RootProps?: PopoverRootProps;
  TriggerProps?: PopoverTriggerProps;
  PortalProps?: PopoverPortalProps;
  BackdropProps?: PopoverBackdropProps;
  PositionerProps?: PopoverPositionerProps;
  PopupProps?: PopoverPopupProps;
}> &
  Pick<PopoverRootProps, "open" | "defaultOpen" | "onOpenChange" | "modal"> &
  PopoverCardProps;
