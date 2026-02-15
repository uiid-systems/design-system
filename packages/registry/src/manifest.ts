import type { Registry } from "./types";

// Layout components
import { BoxEntry } from "./components/box";
import { GroupEntry } from "./components/group";
import { LayerEntry } from "./components/layer";
import { SeparatorEntry } from "./components/separator";
import { StackEntry } from "./components/stack";

// Button components
import { ButtonEntry } from "./components/button";
import { ToggleButtonEntry } from "./components/toggle-button";

// Form components
import { CheckboxEntry } from "./components/checkbox";
import { CheckboxGroupEntry } from "./components/checkbox-group";
import { FormEntry } from "./components/form";
import { InputEntry } from "./components/input";
import { RadioEntry } from "./components/radio";
import { RadioGroupEntry } from "./components/radio-group";
import { SelectEntry } from "./components/select";
import { SwitchEntry } from "./components/switch";
import { TextareaEntry } from "./components/textarea";

// Typography components
import { TextEntry } from "./components/text";

// Card components
import { CardEntry } from "./components/card";

// Interactive components
import { CollapsibleEntry } from "./components/collapsible";

// Overlay components
import { DrawerEntry } from "./components/drawer";
import { ModalEntry } from "./components/modal";
import { PopoverEntry } from "./components/popover";
import { SheetEntry } from "./components/sheet";
import { ToasterEntry } from "./components/toaster";
import { TooltipEntry } from "./components/tooltip";

// Indicator components
import { AlertEntry } from "./components/alert";
import { AvatarEntry } from "./components/avatar";
import { BadgeEntry } from "./components/badge";
import { KbdEntry } from "./components/kbd";
import { StatusEntry } from "./components/status";
import { TimelineEntry } from "./components/timeline";

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
  Form: FormEntry,
  Input: InputEntry,
  Textarea: TextareaEntry,
  Checkbox: CheckboxEntry,
  CheckboxGroup: CheckboxGroupEntry,
  Radio: RadioEntry,
  RadioGroup: RadioGroupEntry,
  Select: SelectEntry,
  Switch: SwitchEntry,

  // Typography
  Text: TextEntry,

  // Cards
  Card: CardEntry,

  // Interactive
  Collapsible: CollapsibleEntry,

  // Overlays
  Drawer: DrawerEntry,
  Modal: ModalEntry,
  Popover: PopoverEntry,
  Sheet: SheetEntry,
  Toaster: ToasterEntry,
  Tooltip: TooltipEntry,

  // Indicators
  Alert: AlertEntry,
  Avatar: AvatarEntry,
  Badge: BadgeEntry,
  Kbd: KbdEntry,
  Status: StatusEntry,
  Timeline: TimelineEntry,
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
