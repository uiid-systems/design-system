import type { Dialog } from "@base-ui-components/react/dialog";

export type ModalProps = React.PropsWithChildren<{
  title: string;
  description: string;
  RootProps?: Dialog.Root.Props;
  PortalProps?: Dialog.Portal.Props;
  BackdropProps?: Dialog.Backdrop.Props;
  PopupProps?: Omit<Dialog.Popup.Props, "children">;
  TitleProps?: Omit<Dialog.Title.Props, "children">;
  DescriptionProps?: Omit<Dialog.Description.Props, "children">;
  CloseProps?: Dialog.Close.Props;
}>;
