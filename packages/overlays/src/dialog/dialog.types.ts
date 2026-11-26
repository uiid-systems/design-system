import type { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ButtonProps } from "@uiid/buttons";
import type { CardProps } from "@uiid/cards";
import type {
  VariantProps,
  WithStringClassName,
  WithTriggerChildren,
} from "@uiid/utils";

import { dialogVariants } from "./dialog.variants";

export type DialogVariants = VariantProps<typeof dialogVariants>;

type DialogCardProps = Pick<
  CardProps,
  "title" | "description" | "action" | "footer"
>;

export type DialogRootProps = BaseDialog.Root.Props;
export type DialogTriggerProps = WithTriggerChildren<
  WithStringClassName<BaseDialog.Trigger.Props>,
  BaseDialog.Trigger.State
>;
export type DialogPortalProps = BaseDialog.Portal.Props;
export type DialogBackdropProps =
  WithStringClassName<BaseDialog.Backdrop.Props>;
export type DialogViewportProps =
  WithStringClassName<BaseDialog.Viewport.Props>;
type DialogPopupBaseProps = VariantProps<typeof dialogVariants> &
  Omit<WithStringClassName<BaseDialog.Popup.Props>, "title">;

/** The popup rendered as a Card, with its slots and header close button. */
type DialogCardPopupProps = DialogPopupBaseProps &
  DialogCardProps & {
    /** Leave out the header close button, for a dialog the user must act on before leaving */
    hideCloseButton?: boolean;
    unstyled?: false;
  };

/** The bare popup: no Card, so none of its slots. */
type DialogUnstyledPopupProps = DialogPopupBaseProps & {
  [Key in keyof DialogCardProps | "hideCloseButton"]?: never;
} & {
  /**
   * Render the popup without its Card: no surface, padding, header, footer or
   * scrolling body, and the children as its direct content. It keeps the size,
   * the transition and the stacking. Name the dialog with `aria-label` or
   * `aria-labelledby`, since there is no title to name it.
   */
  unstyled: true;
};

export type DialogPopupProps = DialogCardPopupProps | DialogUnstyledPopupProps;

export type DialogProps = React.PropsWithChildren<{
  /**
   * Work started from the dialog is in flight. Escape, a backdrop click, the
   * header close button and `DialogClose` can't close it, and the close controls
   * render disabled. Setting `open` to false still closes it.
   */
  pending?: boolean;
  trigger?: DialogTriggerProps["children"];
  RootProps?: DialogRootProps;
  /** Reaches the trigger. Its content is `trigger`. */
  TriggerProps?: Omit<DialogTriggerProps, "children">;
  PortalProps?: DialogPortalProps;
  BackdropProps?: DialogBackdropProps;
  ViewportProps?: DialogViewportProps;
  /** Reaches the popup. `size`, the card slots, `hideCloseButton` and `children` are set on Dialog itself; `unstyled` belongs to the `DialogPopup` part only. */
  PopupProps?: Omit<
    DialogCardPopupProps,
    | "unstyled"
    | "size"
    | "title"
    | "description"
    | "action"
    | "footer"
    | "hideCloseButton"
    | "children"
  >;
}> &
  DialogVariants &
  Pick<DialogRootProps, "open" | "defaultOpen" | "onOpenChange" | "modal"> &
  Pick<DialogCardPopupProps, "hideCloseButton"> &
  DialogCardProps;

/** A footer button that closes the dialog; Base UI's Close owns `render`. */
export type DialogCloseProps = Omit<ButtonProps, "render">;
