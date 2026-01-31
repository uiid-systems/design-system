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

import { categories, registry } from "@uiid/registry";

import { toSlug, urls } from "@/constants/urls";

/**
 * Icon mapping for categories (kept in docs — icons are React components).
 */
const CATEGORY_ICONS: Record<string, Icon> = {
  layout: LayoutGrid,
  typography: Type,
  buttons: MousePointerClick,
  cards: CreditCard,
  forms: FormInput,
  overlays: Layers,
};

/**
 * Get all categories that have at least one registry component, in canonical order.
 */
export function getCategories(): string[] {
  const used = new Set<string>();
  Object.values(registry).forEach((entry) => {
    if (entry.category) {
      used.add(entry.category);
    }
  });
  return categories.filter((c) => used.has(c.key)).map((c) => c.key);
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
 * Get the icon for a category key.
 */
export function getCategoryIcon(category: string): Icon | undefined {
  return CATEGORY_ICONS[category];
}

/**
 * Get the label for a category key.
 */
export function getCategoryLabel(category: string): string {
  const meta = categories.find((c) => c.key === category);
  return meta?.label ?? category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Generate navigation items for the sidebar
 */
export function generateDocsNav(): (ListItemProps | ListItemGroupProps)[] {
  return getCategories().map((category) => {
    const components = getComponentsByCategory(category);

    return {
      category: getCategoryLabel(category),
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
