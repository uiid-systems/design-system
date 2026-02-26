import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { blocks, type BlockFile } from "@uiid/blocks";
import { jsonResponse } from "../utils.js";

/**
 * Use Pick (not Omit) so BlockMetadata exactly matches the fields we
 * construct in toMetadata. If BlockFile gains new fields, this type
 * won't silently include them.
 */
type BlockMetadata = Pick<
  BlockFile,
  | "name"
  | "slug"
  | "description"
  | "tags"
  | "category"
  | "components"
  | "complexity"
  | "elementCount"
>;

function toMetadata(block: BlockFile): BlockMetadata {
  return {
    name: block.name,
    slug: block.slug,
    description: block.description,
    tags: block.tags,
    category: block.category,
    components: block.components,
    complexity: block.complexity,
    elementCount: block.elementCount,
  };
}

export function registerSearchBlocks(server: McpServer) {
  server.tool(
    "search-blocks",
    "Search pre-built UIID blocks by query string, tags, category, or component usage. Returns metadata only (not the full tree). Use get-block to fetch the full block by slug.",
    {
      query: z
        .string()
        .optional()
        .describe(
          "Free-text search across name, description, and tags"
        ),
      tags: z
        .array(z.string())
        .optional()
        .describe('Filter by tags, OR logic (e.g. ["auth", "login"])'),
      category: z
        .string()
        .optional()
        .describe(
          "Filter by category (authentication, forms, settings, cards, content)"
        ),
      component: z
        .string()
        .optional()
        .describe(
          'Filter by component usage (e.g. "Button", "Card")'
        ),
    },
    async ({ query, tags, category, component }) => {
      let results = Object.values(blocks);

      if (category) {
        results = results.filter((b) => b.category === category);
      }

      if (tags && tags.length > 0) {
        results = results.filter((b) =>
          tags.some((tag) => b.tags.includes(tag))
        );
      }

      if (component) {
        results = results.filter((b) => b.components.includes(component));
      }

      if (query) {
        const q = query.toLowerCase();
        results = results.filter((b) => {
          const haystack = [b.name, b.description, ...b.tags]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q);
        });
      }

      return jsonResponse({
        blocks: results.map(toMetadata),
        total: results.length,
      });
    }
  );
}
