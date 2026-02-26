import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { blocks } from "@uiid/blocks";
import { jsonResponse, errorResponse } from "../utils.js";

export function registerGetBlock(server: McpServer) {
  server.tool(
    "get-block",
    "Fetch a specific pre-built UIID block by slug. Returns the full BlockFile including the component tree, ready for rendering.",
    {
      slug: z
        .string()
        .describe(
          'Block slug, e.g. "login-email-google", "workspace-settings-page"'
        ),
    },
    async ({ slug }) => {
      const block = blocks[slug];

      if (!block) {
        const available = Object.keys(blocks).join(", ");
        return errorResponse(
          `Block "${slug}" not found. Available blocks: ${available}`
        );
      }

      return jsonResponse(block);
    }
  );
}
