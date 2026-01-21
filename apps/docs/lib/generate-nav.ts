import type { ListItemGroupProps, ListItemProps } from "@uiid/lists";
import type { Icon } from "@uiid/icons";
import {
  LayoutGrid,
  MousePointerClick,
  FormInput,
  Type,
  CreditCard,
  Layers,
} from "@uiid/icons";

import { registry } from "@uiid/registry";

import { toSlug, urls } from "@/constants/urls";

/**
 * Category configuration with display labels and icons
 */
type CategoryConfig = {
  label: string;
  icon: Icon;
  order: number;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  layout: {
    label: "Layout",
    icon: LayoutGrid,
    order: 1,
  },
  buttons: {
    label: "Buttons",
    icon: MousePointerClick,
    order: 2,
  },
  forms: {
    label: "Forms",
    icon: FormInput,
    order: 3,
  },
  typography: {
    label: "Typography",
    icon: Type,
    order: 4,
  },
  cards: {
    label: "Cards",
    icon: CreditCard,
    order: 5,
  },
  overlays: {
    label: "Overlays",
    icon: Layers,
    order: 6,
  },
};

/**
 * Get all unique categories from the registry, sorted by config order
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  Object.values(registry).forEach((entry) => {
    if (entry.category) {
      categories.add(entry.category);
    }
  });
  return Array.from(categories).sort((a, b) => {
    const orderA = CATEGORY_CONFIG[a]?.order ?? 99;
    const orderB = CATEGORY_CONFIG[b]?.order ?? 99;
    return orderA - orderB;
  });
}

/**
 * Get components for a specific category, sorted alphabetically
 */
export function getComponentsByCategory(category: string) {
  return Object.values(registry)
    .filter((entry) => entry.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Generate navigation items for the sidebar
 */
export function generateDocsNav(): (ListItemProps | ListItemGroupProps)[] {
  const categories = getCategories();

  return categories.map((category) => {
    const config = CATEGORY_CONFIG[category] || {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      icon: LayoutGrid,
    };
    const components = getComponentsByCategory(category);

    return {
      category: config.label,
      icon: config.icon,
      collapsible: true,
      items: components.map((component) => ({
        label: component.name,
        value: urls.component(category, toSlug(component.name)),
        href: urls.component(category, toSlug(component.name)),
      })),
    } satisfies ListItemGroupProps;
  });
}

/**
 * Get total component count
 */
export function getComponentCount(): number {
  return Object.keys(registry).length;
}

/**
 * Get component count by category
 */
export function getCategoryComponentCount(category: string): number {
  return getComponentsByCategory(category).length;
}
