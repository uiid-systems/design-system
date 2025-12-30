import type { Dialog as BaseDialog } from "@base-ui/react/dialog";

import type { VariantProps } from "@uiid/utils";

import { modalVariants } from "./modal.variants";

export type ModalRootProps = BaseDialog.Root.Props;
export type ModalTriggerProps = BaseDialog.Trigger.Props;
export type ModalPortalProps = BaseDialog.Portal.Props;
export type ModalBackdropProps = BaseDialog.Backdrop.Props;
export type ModalPopupProps = VariantProps<typeof modalVariants> &
  BaseDialog.Popup.Props;

export type ModalProps = VariantProps<typeof modalVariants> &
  React.PropsWithChildren<{
    trigger?: React.ReactNode;
    RootProps?: ModalRootProps;
    TriggerProps?: ModalTriggerProps;
    PortalProps?: ModalPortalProps;
    BackdropProps?: ModalBackdropProps;
    PopupProps?: ModalPopupProps;
  }>;
