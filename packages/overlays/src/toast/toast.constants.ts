import type { ToastRootProps, ToastViewportProps } from "./toast.types";

type ToastPosition = NonNullable<ToastViewportProps["position"]>;

export const TOAST_DEFAULT_POSITION: ToastPosition = "bottom";

/**
 * Toward the edge the stack is anchored to, or off the right side. Base UI's
 * default (`down`, `right`) would drag a top-anchored toast into the page.
 */
export const TOAST_SWIPE_DIRECTIONS: Record<
  ToastPosition,
  NonNullable<ToastRootProps["swipeDirection"]>
> = {
  top: ["up", "right"],
  bottom: ["down", "right"],
};

/** Base UI's `promise()` sets this type while the promise is pending. */
export const TOAST_LOADING_TYPE = "loading";
