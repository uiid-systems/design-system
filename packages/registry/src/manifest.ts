import type { Registry } from "./types";

// Layout components
import {
  BoxEntry,
  GroupEntry,
  LayerEntry,
  SeparatorEntry,
  StackEntry,
} from "./schemas/layout";

// Button components
import { ButtonEntry, ToggleButtonEntry } from "./schemas/buttons";

// Form components
import {
  CheckboxEntry,
  InputEntry,
  SelectEntry,
  SwitchEntry,
  TextareaEntry,
} from "./schemas/forms";

// Typography components
import { TextEntry } from "./schemas/typography";

// Card components
import { CardEntry } from "./schemas/cards";

// Overlay components
import {
  DrawerEntry,
  ModalEntry,
  PopoverEntry,
  SheetEntry,
  ToasterEntry,
  TooltipEntry,
} from "./schemas/overlays";

/**
 * Complete registry of all UIID components.
 * Maps component names to their entries (schema, metadata, defaults).
 */
export const registry: Registry = {
  // Layout
  Box: BoxEntry,
  Stack: StackEntry,
  Group: GroupEntry,
  Layer: LayerEntry,
  Separator: SeparatorEntry,

  // Buttons
  Button: ButtonEntry,
  ToggleButton: ToggleButtonEntry,

  // Forms
  Input: InputEntry,
  Textarea: TextareaEntry,
  Checkbox: CheckboxEntry,
  Select: SelectEntry,
  Switch: SwitchEntry,

  // Typography
  Text: TextEntry,

  // Cards
  Card: CardEntry,

  // Overlays
  Drawer: DrawerEntry,
  Modal: ModalEntry,
  Popover: PopoverEntry,
  Sheet: SheetEntry,
  Toaster: ToasterEntry,
  Tooltip: TooltipEntry,
};

/**
 * List of all component names in the registry.
 */
export const componentNames = Object.keys(registry) as Array<
  keyof typeof registry
>;

/**
 * Get components by category.
 */
export const getComponentsByCategory = (category: string) =>
  Object.values(registry).filter((entry) => entry.category === category);

/**
 * Get components by package.
 */
export const getComponentsByPackage = (packageName: string) =>
  Object.values(registry).filter((entry) => entry.package === packageName);
