import type { z } from "zod";
import type { CategoryKey } from "./categories";

/**
 * A single element in a preview tree.
 */
export type PreviewElement = {
  key: string;
  type: string;
  props: Record<string, unknown>;
  children?: string[];
  parentKey?: string;
  /** If set, render this element into the parent's prop with this name instead of as children */
  slot?: string;
};

/**
 * A labeled UI tree structure for component previews.
 * Framework-agnostic representation that can be rendered
 * by docs, json-render, or any tree renderer.
 */
export type PreviewConfig = {
  label: string;
  tree: {
    root: string;
    elements: Record<string, PreviewElement>;
  };
};

/**
 * Metadata for a single component in the registry.
 * Framework-agnostic structure that can be consumed by
 * json-render, a2ui, or any AI-to-UI library.
 */
export type ComponentEntry<T extends z.ZodType = z.ZodType> = {
  /** Component display name (e.g., "Button") */
  name: string;

  /** Source package (e.g., "@uiid/buttons") */
  package: string;

  /** Whether component accepts children */
  hasChildren: boolean;

  /** Zod schema for props validation */
  propsSchema: T;

  /** Description for AI context */
  description?: string;

  /** Default prop values */
  defaults?: Record<string, unknown>;

  /** Category for organization (e.g., "layout", "forms", "overlays") */
  category?: CategoryKey;

  /** Preview trees for documentation and json-render initial states */
  previews?: PreviewConfig[];

  /** Props that accept rich content (slot name → description) */
  slots?: Record<string, string>;

  /** Short LLM-oriented usage note */
  usage?: string;
};

/**
 * The complete registry mapping component names to their entries.
 */
export type Registry = Record<string, ComponentEntry>;

/**
 * Helper type to extract props type from a ComponentEntry's schema.
 */
export type InferProps<T extends ComponentEntry> = T["propsSchema"] extends z.ZodType<infer P>
  ? P
  : never;

/**
 * Documentation for a single prop extracted from a Zod schema.
 */
export type PropDocumentation = {
  /** Property name */
  name: string;
  /** TypeScript type representation */
  type: string;
  /** Whether the prop is required */
  required: boolean;
  /** Description from JSDoc comment (if available) */
  description?: string;
  /** Default value (if set in schema or component defaults) */
  defaultValue?: unknown;
  /** Enum values (for z.enum types) */
  enumValues?: string[];
};

/**
 * Full documentation for a component.
 */
export type ComponentDocumentation = {
  /** Component name */
  name: string;
  /** Package name */
  package: string;
  /** Component description */
  description?: string;
  /** Category */
  category?: string;
  /** Whether component accepts children */
  hasChildren: boolean;
  /** Documented props */
  props: PropDocumentation[];
};
