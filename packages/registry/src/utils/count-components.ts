/**
 * Counts component usage within a flat element tree.
 * Works with any tree structure that has `{ elements: Record<string, { type: string }> }`,
 * including PreviewConfig["tree"] and UITree from @json-render/core.
 */

type ElementTree = {
  elements: Record<string, { type: string }>;
};

export type ComponentCount = {
  /** Map of component type names to their occurrence count */
  counts: Record<string, number>;
  /** Total number of elements in the tree */
  total: number;
  /** Number of unique component types used */
  unique: number;
};

export function countComponents(tree: ElementTree): ComponentCount {
  const counts: Record<string, number> = {};
  for (const el of Object.values(tree.elements)) {
    counts[el.type] = (counts[el.type] ?? 0) + 1;
  }
  return {
    counts,
    total: Object.values(tree.elements).length,
    unique: Object.keys(counts).length,
  };
}
