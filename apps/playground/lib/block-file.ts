import type { UISpec } from "./catalog";

/**
 * Schema for a block JSON file stored in the blocks/ directory.
 * This is the on-disk format used for sharing and version-controlling blocks.
 */
export type BlockFile = {
  /** Human-readable name */
  name: string;
  /** Slug used as the filename (e.g., "login-form") */
  slug: string;
  /** Optional description */
  description: string;
  /** Version number */
  version: number;
  /** Tags for categorization (not yet surfaced in UI) */
  tags: string[];
  /** The UI tree */
  tree: UISpec;
  /** ISO 8601 timestamps */
  createdAt: string;
  updatedAt: string;
};

/**
 * Convert a name to a URL/filename-safe slug.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
