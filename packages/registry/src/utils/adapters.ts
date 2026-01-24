import type { z } from "zod";

import { registry } from "../manifest";

/**
 * Generates a component-name → package mapping from registry entries.
 * Replaces hardcoded COMPONENT_PACKAGES maps in consumers like json-render.
 */
export function getPackageMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [name, entry] of Object.entries(registry)) {
    map[name] = entry.package;
  }
  return map;
}

/**
 * Generates catalog-compatible entries from registry.
 * Returns the shape expected by json-render's `createCatalog({ components })`.
 */
export function getCatalogEntries(): Record<
  string,
  { props: z.ZodType; hasChildren: boolean }
> {
  const entries: Record<string, { props: z.ZodType; hasChildren: boolean }> = {};
  for (const [name, entry] of Object.entries(registry)) {
    entries[name] = {
      props: entry.propsSchema,
      hasChildren: entry.hasChildren,
    };
  }
  return entries;
}
