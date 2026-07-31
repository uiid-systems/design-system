/**
 * Base UI's drawer type namespaces are named `DrawerRoot`, `DrawerPopup`, … which
 * collide with our own part names, so they're reached through one namespace import.
 */
import type * as BaseDrawer from "@base-ui/react/drawer";

import type { CardProps } from "@uiid/cards";

type DrawerCardProps = Pick<
  CardProps,
  "title" | "description" | "action" | "icon" | "footer"
>;

export type DrawerProviderProps = BaseDrawer.DrawerProvider.Props;
export type DrawerIndentProps = BaseDrawer.DrawerIndent.Props;
export type DrawerIndentBackgroundProps =
  BaseDrawer.DrawerIndentBackground.Props;
export type DrawerRootProps = BaseDrawer.DrawerRoot.Props;
export type DrawerTriggerProps = BaseDrawer.DrawerTrigger.Props;
export type DrawerPortalProps = BaseDrawer.DrawerPortal.Props;
export type DrawerBackdropProps = BaseDrawer.DrawerBackdrop.Props;
export type DrawerViewportProps = BaseDrawer.DrawerViewport.Props;
export type DrawerContentProps = BaseDrawer.DrawerContent.Props;
export type DrawerCloseProps = BaseDrawer.DrawerClose.Props;
export type DrawerTitleProps = BaseDrawer.DrawerTitle.Props;
export type DrawerDescriptionProps = BaseDrawer.DrawerDescription.Props;

export type DrawerSwipeDirection = BaseDrawer.DrawerRoot.Props["swipeDirection"];
export type DrawerSnapPoint = BaseDrawer.DrawerRoot.SnapPoint;

export type DrawerPopupProps = Omit<BaseDrawer.DrawerPopup.Props, "title"> &
  DrawerCardProps;

export type DrawerProps = React.PropsWithChildren<{
  trigger?: React.ReactNode;
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
  DrawerCardProps;
