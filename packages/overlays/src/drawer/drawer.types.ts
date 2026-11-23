/**
 * Base UI's drawer type namespaces are named `DrawerRoot`, `DrawerPopup`, … which
 * collide with our own part names, so they're reached through one namespace import.
 */
import type * as BaseDrawer from "@base-ui/react/drawer";
import type { ButtonProps } from "@uiid/buttons";
import type { CardProps } from "@uiid/cards";
import type { WithStringClassName, WithTriggerChildren } from "@uiid/utils";

type DrawerCardProps = Pick<
  CardProps,
  "title" | "description" | "action" | "footer"
>;

export type DrawerRootProps = BaseDrawer.DrawerRoot.Props;
export type DrawerTriggerProps = WithTriggerChildren<
  WithStringClassName<BaseDrawer.DrawerTrigger.Props>,
  BaseDrawer.DrawerTrigger.State
>;
export type DrawerSwipeAreaProps = BaseDrawer.DrawerSwipeArea.Props;
export type DrawerPortalProps = BaseDrawer.DrawerPortal.Props;
export type DrawerBackdropProps =
  WithStringClassName<BaseDrawer.DrawerBackdrop.Props>;
export type DrawerViewportProps =
  WithStringClassName<BaseDrawer.DrawerViewport.Props>;
export type DrawerContentProps = BaseDrawer.DrawerContent.Props;

export type DrawerSwipeDirection =
  BaseDrawer.DrawerRoot.Props["swipeDirection"];
export type DrawerSnapPoint = BaseDrawer.DrawerRoot.SnapPoint;

export type DrawerPopupProps = Omit<
  WithStringClassName<BaseDrawer.DrawerPopup.Props>,
  "title"
> &
  DrawerCardProps & {
    /** Leave out the header close button, for a drawer the user must act on before leaving */
    hideCloseButton?: boolean;
  };

export type DrawerProps = React.PropsWithChildren<{
  /**
   * Work started from the drawer is in flight. Escape, a backdrop click, a
   * swipe, the header close button and `DrawerClose` can't close it, and the
   * close controls render disabled. Setting `open` to false still closes it.
   */
  pending?: boolean;
  trigger?: DrawerTriggerProps["children"];
  RootProps?: DrawerRootProps;
  TriggerProps?: DrawerTriggerProps;
  PortalProps?: DrawerPortalProps;
  BackdropProps?: DrawerBackdropProps;
  ViewportProps?: DrawerViewportProps;
  PopupProps?: DrawerPopupProps;
  ContentProps?: DrawerContentProps;
}> &
  Pick<
    DrawerRootProps,
    | "open"
    | "defaultOpen"
    | "onOpenChange"
    | "modal"
    | "swipeDirection"
    | "snapPoints"
    | "snapPoint"
    | "defaultSnapPoint"
    | "onSnapPointChange"
  > &
  Pick<DrawerPopupProps, "hideCloseButton"> &
  DrawerCardProps;

/** A footer button that closes the drawer; Base UI's Close owns `render`. */
export type DrawerCloseProps = Omit<ButtonProps, "render">;
