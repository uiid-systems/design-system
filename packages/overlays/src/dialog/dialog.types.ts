import type { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { CardProps } from "@uiid/cards";
import type { VariantProps, WithTriggerChildren } from "@uiid/utils";

import { dialogVariants } from "./dialog.variants";

export type DialogVariants = VariantProps<typeof dialogVariants>;

type DialogCardProps = Pick<
  CardProps,
  "title" | "description" | "action" | "icon" | "footer"
>;

export type DialogRootProps = BaseDialog.Root.Props;
export type DialogTriggerProps = WithTriggerChildren<
  BaseDialog.Trigger.Props,
  BaseDialog.Trigger.State
>;
export type DialogPortalProps = BaseDialog.Portal.Props;
export type DialogBackdropProps = BaseDialog.Backdrop.Props;
export type DialogViewportProps = BaseDialog.Viewport.Props;
export type DialogPopupProps = VariantProps<typeof dialogVariants> &
  Omit<BaseDialog.Popup.Props, "title"> &
  DialogCardProps;

export type DialogProps = React.PropsWithChildren<{
  trigger?: DialogTriggerProps["children"];
  RootProps?: DialogRootProps;
  TriggerProps?: DialogTriggerProps;
  PortalProps?: DialogPortalProps;
  BackdropProps?: DialogBackdropProps;
  ViewportProps?: DialogViewportProps;
  PopupProps?: DialogPopupProps;
}> &
  DialogVariants &
  Pick<DialogRootProps, "open" | "onOpenChange"> &
  DialogCardProps;
