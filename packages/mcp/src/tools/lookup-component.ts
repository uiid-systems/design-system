import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registry } from "@uiid/registry";
import { extractPropsFromSchema } from "@uiid/registry";
import { jsonResponse, errorResponse } from "../utils.js";

export function registerLookupComponent(server: McpServer) {
  server.tool(
    "lookup-component",
    "Get detailed metadata for a single UIID component: props extracted from its Zod schema, slots, defaults, and usage guidance. Use this to understand how to use a component correctly.",
    {
      name: z
        .string()
        .describe('Component name, e.g. "Button", "Card", "Stack"'),
    },
    async ({ name }) => {
      // Exact match first, then case-insensitive fallback
      const entry =
        registry[name] ??
        Object.entries(registry).find(
          ([key]) => key.toLowerCase() === name.toLowerCase()
        )?.[1];

      if (!entry) {
        const available = Object.keys(registry).join(", ");
        return errorResponse(
          `Component "${name}" not found. Available components: ${available}`
        );
      }

      const props = extractPropsFromSchema(
        entry.propsSchema,
        entry.defaults
      ).map((prop) => ({
        name: prop.name,
        type: prop.type,
        required: prop.required,
        description: prop.description,
        defaultValue: prop.defaultValue,
        enumValues: prop.enumValues,
      }));

      return jsonResponse({
        name: entry.name,
        package: entry.package,
        category: entry.category,
        description: entry.description,
        hasChildren: entry.hasChildren,
        usage: entry.usage,
        slots: entry.slots,
        defaults: entry.defaults,
        props,
      });
    }
  );
}
