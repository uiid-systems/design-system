import type {
  TooltipPositionerProps,
  TooltipProviderProps,
} from "./tooltip.types";

// The same timing and placement as Button's own `tooltip`.
export const TOOLTIP_DEFAULT_DELAY: TooltipProviderProps["delay"] = 300;
export const TOOLTIP_DEFAULT_SIDE_OFFSET: TooltipPositionerProps["sideOffset"] = 8;
export const TOOLTIP_DEFAULT_COLLISION_PADDING: TooltipPositionerProps["collisionPadding"] = 16;
