/**
 * Custom Vite config for the MCP server.
 *
 * This does NOT use the shared createViteConfig() factory because the MCP
 * server is a Node CLI, not a React component library. Key differences:
 * - Target: node20 (not browser)
 * - @uiid/* packages are INLINED (not external) so the CLI is self-contained
 * - No React plugin, no CSS handling, no preserveModules
 * - Shebang banner for `npx` execution
 */
import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    target: "node20",
    outDir: "dist",
    minify: false,
    rollupOptions: {
      external: [
        "@modelcontextprotocol/sdk",
        "@modelcontextprotocol/sdk/server/mcp.js",
        "@modelcontextprotocol/sdk/server/stdio.js",
        "zod",
        /^node:/,
      ],
      output: {
        banner: "#!/usr/bin/env node",
      },
    },
  },
});
