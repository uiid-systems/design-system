// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as overlays from "./index";

// Components, their parts and their prop types, plus the toast manager hooks
// a Toaster cannot be used without. Constants, variant functions, the pending
// contexts, the header close buttons and the shared helpers are internal.
const values = [
  "Dialog",
  "DialogBackdrop",
  "DialogClose",
  "DialogPopup",
  "DialogPortal",
  "DialogRoot",
  "DialogTrigger",
  "DialogViewport",
  "Drawer",
  "DrawerBackdrop",
  "DrawerClose",
  "DrawerContent",
  "DrawerPopup",
  "DrawerPortal",
  "DrawerRoot",
  "DrawerSwipeArea",
  "DrawerTrigger",
  "DrawerViewport",
  "Popover",
  "PopoverBackdrop",
  "PopoverPopup",
  "PopoverPortal",
  "PopoverPositioner",
  "PopoverRoot",
  "PopoverTrigger",
  "ToastAction",
  "ToastClose",
  "ToastContent",
  "ToastDescription",
  "ToastPortal",
  "ToastProvider",
  "ToastRoot",
  "ToastTitle",
  "ToastViewport",
  "Toaster",
  "Tooltip",
  "TooltipPopup",
  "TooltipPortal",
  "TooltipPositioner",
  "TooltipProvider",
  "TooltipRoot",
  "TooltipTrigger",
  "createToastManager",
  "useToastManager",
];

const types = [
  "DialogBackdropProps",
  "DialogCloseProps",
  "DialogPopupProps",
  "DialogPortalProps",
  "DialogProps",
  "DialogRootProps",
  "DialogTriggerProps",
  "DialogVariants",
  "DialogViewportProps",
  "DrawerBackdropProps",
  "DrawerCloseProps",
  "DrawerContentProps",
  "DrawerPopupProps",
  "DrawerPortalProps",
  "DrawerProps",
  "DrawerRootProps",
  "DrawerSnapPoint",
  "DrawerSwipeAreaProps",
  "DrawerSwipeDirection",
  "DrawerTriggerProps",
  "DrawerViewportProps",
  "PopoverBackdropProps",
  "PopoverPopupProps",
  "PopoverPortalProps",
  "PopoverPositionerProps",
  "PopoverProps",
  "PopoverRootProps",
  "PopoverTriggerProps",
  "ToastActionProps",
  "ToastCloseProps",
  "ToastContentProps",
  "ToastData",
  "ToastDescriptionProps",
  "ToastObject",
  "ToastPortalProps",
  "ToastProviderProps",
  "ToastRootProps",
  "ToastTitleProps",
  "ToastType",
  "ToastViewportProps",
  "ToasterProps",
  "TooltipPopupProps",
  "TooltipPortalProps",
  "TooltipPositionerProps",
  "TooltipProps",
  "TooltipProviderProps",
  "TooltipRootProps",
  "TooltipTriggerProps",
];

describe("@uiid/overlays barrel", () => {
  it("exports exactly the components, parts and toast hooks", () => {
    expect(Object.keys(overlays).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
