"use client";

import type { ComponentType } from "react";

import {
  BoxPreview,
  StackPreview,
  GroupPreview,
  LayerPreview,
  SeparatorPreview,
  ButtonPreview,
  ToggleButtonPreview,
  InputPreview,
  TextareaPreview,
  CheckboxPreview,
  SelectPreview,
  SwitchPreview,
  TextPreview,
  CardPreview,
  ModalPreview,
  DrawerPreview,
  PopoverPreview,
  SheetPreview,
  ToasterPreview,
  TooltipPreview,
} from "@/components/previews";

/**
 * Registry of preview components keyed by component name
 */
export const previewRegistry: Record<string, ComponentType> = {
  // Layout
  Box: BoxPreview,
  Stack: StackPreview,
  Group: GroupPreview,
  Layer: LayerPreview,
  Separator: SeparatorPreview,

  // Buttons
  Button: ButtonPreview,
  ToggleButton: ToggleButtonPreview,

  // Forms
  Input: InputPreview,
  Textarea: TextareaPreview,
  Checkbox: CheckboxPreview,
  Select: SelectPreview,
  Switch: SwitchPreview,

  // Typography
  Text: TextPreview,

  // Cards
  Card: CardPreview,

  // Overlays
  Modal: ModalPreview,
  Drawer: DrawerPreview,
  Popover: PopoverPreview,
  Sheet: SheetPreview,
  Toaster: ToasterPreview,
  Tooltip: TooltipPreview,
};

/**
 * Get the preview component for a given component name
 */
export function getPreviewComponent(
  componentName: string
): ComponentType | undefined {
  return previewRegistry[componentName];
}
