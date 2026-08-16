import type {
  TooltipPositionerProps,
  TooltipProviderProps,
} from "@base-ui/react/tooltip";

import type {
  ButtonVariants,
  ButtonContentContainerProps,
} from "./button.types";

export const BUTTON_DEFAULT_SIZE: ButtonVariants["size"] = "medium";
export const BUTTON_DEFAULT_GAP: ButtonContentContainerProps["gap"] = 2;

export const BUTTON_TOOLTIP_DELAY: TooltipProviderProps["delay"] = 300;
export const BUTTON_TOOLTIP_SIDE_OFFSET: TooltipPositionerProps["sideOffset"] = 8;
export const BUTTON_TOOLTIP_COLLISION_PADDING: TooltipPositionerProps["collisionPadding"] = 16;
