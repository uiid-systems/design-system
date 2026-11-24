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
  /** Reaches the trigger. Its content is `trigger`. */
  TriggerProps?: Omit<PopoverTriggerProps, "children">;
  PortalProps?: PopoverPortalProps;
  BackdropProps?: PopoverBackdropProps;
  PositionerProps?: PopoverPositionerProps;
  /** Reaches the popup. The card slots and `children` are set on Popover itself. */
  PopupProps?: Omit<
    PopoverPopupProps,
    "title" | "description" | "action" | "footer" | "children"
  >;
}> &
  Pick<PopoverRootProps, "open" | "defaultOpen" | "onOpenChange" | "modal"> &
  PopoverCardProps;
