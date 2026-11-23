import type { Toast as BaseToast } from "@base-ui/react/toast";
import type { CardColor } from "@uiid/cards";
import type { WithStringClassName } from "@uiid/utils";

/**
 * The `type` values Toaster gives an icon and a hue. Base UI's `promise()`
 * sets `loading`, `success` and `error`; any other string renders without
 * either.
 */
export type ToastType = "success" | "error" | "warning" | "info" | "loading";

/**
 * What Toaster reads from a toast's `data`. Base UI owns every other field
 * (`title`, `description`, `type`, `timeout`, `actionProps`, …), so only the
 * additions live here — nothing Base UI already ships is recast.
 */
export type ToastData = {
  /**
   * Rendered below the title and description. For content Base UI has no field
   * for — a `Progress` bar on a loading toast, a short list. Pass a new node
   * through `update()` to change it, along with any other `data` field to
   * keep: `update()` replaces `data` whole.
   */
  children?: React.ReactNode;
  /**
   * Palette hue for the toast surface
   * @default the type's hue: green, red, yellow or blue for `success`, `error`, `warning` or `info`; neutral otherwise
   */
  color?: CardColor;
  /**
   * Show the close button.
   * @default true, except for `type: "loading"`, which the app closes by updating it
   */
  closable?: boolean;
};

export type ToastObject<Data extends object = ToastData> =
  BaseToast.Root.ToastObject<Data>;

export type ToastProviderProps = BaseToast.Provider.Props;
export type ToastPortalProps = BaseToast.Portal.Props;
export type ToastViewportProps =
  WithStringClassName<BaseToast.Viewport.Props> & {
    /** Anchor the stack to the top or the bottom of the screen */
    position?: "top" | "bottom";
  };
export type ToastRootProps = WithStringClassName<BaseToast.Root.Props> & {
  /** Palette hue for the toast surface, the `Card` inside the root */
  color?: CardColor;
};
export type ToastContentProps = WithStringClassName<BaseToast.Content.Props>;
export type ToastTitleProps = BaseToast.Title.Props;
export type ToastDescriptionProps =
  WithStringClassName<BaseToast.Description.Props>;
export type ToastActionProps = BaseToast.Action.Props;
export type ToastCloseProps = WithStringClassName<BaseToast.Close.Props>;

export type ToasterProps = Pick<ToastViewportProps, "position"> & {
  /** Props forwarded to the portal, such as the `container` it renders into */
  PortalProps?: ToastPortalProps;
  /** Props forwarded to the viewport */
  ViewportProps?: Omit<ToastViewportProps, "position">;
};
