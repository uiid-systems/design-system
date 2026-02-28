# @uiid/mcp

MCP server for the UIID design system. Exposes component metadata and pre-built blocks to LLMs — no context window cost until a tool is called.

## Tools

| Tool | Description |
|------|-------------|
| `list-components` | Browse components by category or package |
| `lookup-component` | Get a component's props, slots, defaults, and usage |
| `search-blocks` | Search pre-built UI blocks by query, tags, category, or component |
| `get-block` | Fetch a full block definition by slug |

## Setup

### Claude Code

```bash
claude mcp add uiid -- npx -y @uiid/mcp
```

Or add to `.mcp.json` in your project root (shareable with your team):

```json
{
  "mcpServers": {
    "uiid": {
      "command": "npx",
      "args": ["-y", "@uiid/mcp"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "uiid": {
      "command": "npx",
      "args": ["-y", "@uiid/mcp"]
    }
  }
}
```

### VS Code (Copilot)

Add to `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "uiid": {
      "command": "npx",
      "args": ["-y", "@uiid/mcp"]
    }
  }
}
```

Note: VS Code uses `"servers"` as the top-level key, not `"mcpServers"`.

## License

MIT
