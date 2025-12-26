import type { Dialog } from "@base-ui/react/dialog";

import type { CardProps } from "@uiid/cards";

type ModalSize = "sm" | "md" | "lg" | "xl";

export type ModalProps = React.PropsWithChildren<{
  /** A render prop for the trigger element. */
  trigger?: React.ReactNode;
  /** The size of the modal. */
  size?: ModalSize;
  /** Whether the modal is open. */
  open?: boolean;
  /** Callback when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The props for the root element.
   * @see https://base-ui.com/react/components/dialog
   * */
  RootProps?: Dialog.Root.Props;
  /**
   * The props for the trigger element.
   * @see https://base-ui.com/react/components/dialog
   * */
  TriggerProps?: Omit<Dialog.Trigger.Props, "children">;
  /**
   * The props for the popup element.
   * @see https://base-ui.com/react/components/dialog
   * */
  PopupProps?: Omit<Dialog.Popup.Props, "children">;
}> &
  Pick<Dialog.Portal.Props, "keepMounted"> &
  Pick<CardProps, "title" | "onClose" | "showCloseButton">;
