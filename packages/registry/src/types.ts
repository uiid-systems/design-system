import type { z } from "zod";

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

  /** Category for organization (e.g., "layout", "forms", "feedback") */
  category?: string;
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
 * Categories for organizing components in the registry.
 */
export type ComponentCategory =
  | "layout"
  | "forms"
  | "buttons"
  | "typography"
  | "cards"
  | "feedback"
  | "navigation"
  | "data-display";

