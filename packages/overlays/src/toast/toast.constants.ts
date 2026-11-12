import type { CardColor } from "@uiid/cards";
import { CircleAlertIcon } from "@uiid/icons/circle-alert";
import { CircleCheckIcon } from "@uiid/icons/circle-check";
import { InfoIcon } from "@uiid/icons/info";
import { LoadingSpinnerIcon } from "@uiid/icons/loading-spinner";
import { TriangleAlertIcon } from "@uiid/icons/triangle-alert";

import type {
  ToastRootProps,
  ToastType,
  ToastViewportProps,
} from "./toast.types";

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
export const TOAST_LOADING_TYPE = "loading" satisfies ToastType;

/**
 * What each type renders: an icon on the title's line, and the surface hue
 * that `data.color` overrides. A type without a `color` keeps Card's neutral
 * surface. The palette has no amber, so `warning` takes yellow.
 */
export const TOAST_TYPES: Record<
  ToastType,
  { icon: React.ElementType; color?: CardColor }
> = {
  success: { icon: CircleCheckIcon, color: "green" },
  error: { icon: CircleAlertIcon, color: "red" },
  warning: { icon: TriangleAlertIcon, color: "yellow" },
  info: { icon: InfoIcon, color: "blue" },
  loading: { icon: LoadingSpinnerIcon },
};

/** Base UI types `type` as any string; this narrows it to the ones Toaster renders. */
export const isToastType = (type: string | undefined): type is ToastType =>
  type !== undefined && Object.hasOwn(TOAST_TYPES, type);
