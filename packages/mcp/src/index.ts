import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerLookupComponent } from "./tools/lookup-component.js";
import { registerSearchBlocks } from "./tools/search-blocks.js";
import { registerGetBlock } from "./tools/get-block.js";

const server = new McpServer({
  name: "uiid",
  version: "0.0.1",
});

registerListComponents(server);
registerLookupComponent(server);
registerSearchBlocks(server);
registerGetBlock(server);

const transport = new StdioServerTransport();
await server.connect(transport);
