/**
 * URL helper functions for docs navigation
 */

export const urls = {
  home: () => "/",
  category: (category: string) => `/${category}`,
  component: (category: string, component: string) =>
    `/${category}/${component}`,
} as const;

/**
 * Convert component name to URL slug
 * e.g., "ToggleButton" -> "toggle-button"
 */
export function toSlug(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Convert URL slug to display name
 * e.g., "toggle-button" -> "Toggle Button"
 */
export function fromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
