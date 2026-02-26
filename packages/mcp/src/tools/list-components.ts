import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registry,
  categories,
  getComponentsByCategory,
  getComponentsByPackage,
} from "@uiid/registry";
import { jsonResponse } from "../utils.js";

export function registerListComponents(server: McpServer) {
  server.tool(
    "list-components",
    "Browse available UIID components. Returns component summaries with name, package, category, and description. Use with no filters to discover all components, or filter by category or package.",
    {
      category: z
        .string()
        .optional()
        .describe(
          "Filter by category (layout, typography, buttons, cards, forms, indicators, interactive, overlays, navigation)"
        ),
      package: z
        .string()
        .optional()
        .describe(
          "Filter by package (e.g. @uiid/buttons, @uiid/forms)"
        ),
    },
    async ({ category, package: pkg }) => {
      let entries;

      if (category) {
        entries = getComponentsByCategory(category);
      } else if (pkg) {
        entries = getComponentsByPackage(pkg);
      } else {
        entries = Object.values(registry);
      }

      const components = entries.map((entry) => ({
        name: entry.name,
        package: entry.package,
        category: entry.category,
        description: entry.description,
        hasChildren: entry.hasChildren,
      }));

      return jsonResponse({
        components,
        total: components.length,
        ...(!(category || pkg) && {
          categories: categories.map((c) => c.key),
          packages: [
            ...new Set(Object.values(registry).map((e) => e.package)),
          ],
        }),
      });
    }
  );
}
