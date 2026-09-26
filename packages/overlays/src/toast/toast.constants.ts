import type { ToastViewportProps } from "./toast.types";

export const TOAST_DEFAULT_POSITION: NonNullable<
  ToastViewportProps["position"]
> = "bottom";

/** Base UI's `promise()` sets this type while the promise is pending. */
export const TOAST_LOADING_TYPE = "loading";
