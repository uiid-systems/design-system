import type { Dialog } from "@base-ui-components/react/dialog";

export type SheetSide = "top" | "right" | "bottom" | "left";

export type SheetProps = React.PropsWithChildren<{
  /** The title of the sheet. */
  title?: string;
  /** The side of the screen where the sheet will appear. */
  side?: SheetSide;
  /** A render prop for the trigger element. */
  trigger: React.ReactNode;
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
  Partial<Pick<Dialog.Root.Props, "open" | "onOpenChange">>;
