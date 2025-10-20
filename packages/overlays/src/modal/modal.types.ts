import type { Dialog } from "@base-ui-components/react/dialog";

import type { CardProps } from "@uiid/cards";

export type ModalProps = React.PropsWithChildren<{
  /** A render prop for the trigger element. */
  trigger: React.ReactNode;
  /** The title of the modal. */
  title: string;
  /** The content of the modal. */
  children: React.ReactNode;
  /**
   * The props for the root element.
   * @see https://base-ui-components.github.io/react/dialog/#root
   * */
  RootProps?: Dialog.Root.Props;
  /**
   * The props for the trigger element.
   * @see https://base-ui-components.github.io/react/dialog/#trigger
   * */
  TriggerProps?: Omit<Dialog.Trigger.Props, "children">;
  /**
   * The props for the popup element.
   * @see https://base-ui-components.github.io/react/dialog/#popup
   * */
  PopupProps?: Omit<Dialog.Popup.Props, "children">;
}> &
  Pick<Dialog.Portal.Props, "keepMounted"> &
  Partial<Pick<Dialog.Root.Props, "open" | "onOpenChange">> &
  Pick<
    CardProps,
    | "title"
    | "onDismiss"
    | "primaryAction"
    | "secondaryAction"
    | "tertiaryAction"
  >;
