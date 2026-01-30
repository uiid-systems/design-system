import type { ComponentEntry } from "../types";

import {
  DrawerPropsSchema,
  ModalPropsSchema,
  PopoverPropsSchema,
  SheetPropsSchema,
  ToasterPropsSchema,
  TooltipPropsSchema,
} from "../schemas/overlays";

export const ModalEntry: ComponentEntry<typeof ModalPropsSchema> = {
  name: "Modal",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: ModalPropsSchema,
  description: "Dialog overlay with Card-like content structure",
  category: "overlays",
  defaults: {
    size: "medium",
  },
};

export const SheetEntry: ComponentEntry<typeof SheetPropsSchema> = {
  name: "Sheet",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: SheetPropsSchema,
  description: "Slide-in panel overlay from any edge of the screen",
  category: "overlays",
  defaults: {
    side: "right",
  },
};

export const PopoverEntry: ComponentEntry<typeof PopoverPropsSchema> = {
  name: "Popover",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: PopoverPropsSchema,
  description: "Floating card attached to a trigger element",
  category: "overlays",
  defaults: {},
};

export const DrawerEntry: ComponentEntry<typeof DrawerPropsSchema> = {
  name: "Drawer",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: DrawerPropsSchema,
  description: "Bottom sheet with drag-to-close interaction",
  category: "overlays",
  defaults: {
    direction: "bottom",
  },
};

export const TooltipEntry: ComponentEntry<typeof TooltipPropsSchema> = {
  name: "Tooltip",
  package: "@uiid/overlays",
  hasChildren: true,
  propsSchema: TooltipPropsSchema,
  description: "Informational popup shown on hover or focus",
  category: "overlays",
  defaults: {},
};

export const ToasterEntry: ComponentEntry<typeof ToasterPropsSchema> = {
  name: "Toaster",
  package: "@uiid/overlays",
  hasChildren: false,
  propsSchema: ToasterPropsSchema,
  description: "Container for toast notifications",
  category: "overlays",
  defaults: {
    position: "bottom",
  },
};
