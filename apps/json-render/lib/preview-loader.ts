import type { UITree } from "@json-render/core";
import { registry, type PreviewConfig } from "@uiid/registry";

/**
 * Get all components that have preview trees defined.
 */
export function getComponentsWithPreviews(): Array<{
  name: string;
  package: string;
  description?: string;
  previewCount: number;
}> {
  return Object.entries(registry)
    .filter(([, entry]) => entry.previews && entry.previews.length > 0)
    .map(([name, entry]) => ({
      name,
      package: entry.package,
      description: entry.description,
      previewCount: entry.previews!.length,
    }));
}

/**
 * Convert a PreviewConfig tree to a UITree compatible with json-render.
 * Strips `parentKey` fields since UITree elements don't use them.
 */
export function previewToUITree(preview: PreviewConfig): UITree {
  const elements: UITree["elements"] = {};
  for (const [key, element] of Object.entries(preview.tree.elements)) {
    const { parentKey, ...rest } = element;
    elements[key] = rest;
  }
  return {
    root: preview.tree.root,
    elements,
  };
}

/**
 * Get the preview trees for a component by name.
 * Returns null if the component doesn't exist or has no previews.
 */
export function getComponentPreviews(
  componentName: string
): { label: string; tree: UITree }[] | null {
  const entry = registry[componentName];
  if (!entry?.previews || entry.previews.length === 0) return null;

  return entry.previews.map((preview) => ({
    label: preview.label,
    tree: previewToUITree(preview),
  }));
}
