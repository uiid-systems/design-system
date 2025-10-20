import type { Dialog } from "@base-ui-components/react/dialog";

import type { CardProps } from "@uiid/cards";

export type ModalProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  RootProps?: Dialog.Root.Props;
  TriggerProps?: Omit<Dialog.Trigger.Props, "children">;
  PortalProps?: Dialog.Portal.Props;
  BackdropProps?: Dialog.Backdrop.Props;
  PopupProps?: Omit<Dialog.Popup.Props, "children">;
}> &
  Partial<Pick<Dialog.Root.Props, "open" | "onOpenChange">> &
  Pick<
    CardProps,
    | "title"
    | "onDismiss"
    | "primaryAction"
    | "secondaryAction"
    | "tertiaryAction"
  >;
