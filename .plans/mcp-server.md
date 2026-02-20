# MCP Server Plan

## Context

The UIID design system has two data-rich packages -- `@uiid/registry` (40+ components
with Zod schemas, previews, usage docs) and `@uiid/blocks` (9 pre-built JSON UI
compositions, growing to 50+). Today, AGENTS.md files provide LLM guidance, but that
only works inside the monorepo. Once UIID ships as npm packages, consumers' LLMs have
no idea what components exist, what props they accept, or that pre-built blocks are
available.

An MCP server solves this distribution problem. Tools appear automatically in the LLM's
tool list with zero context window cost until called. Block search scales to hundreds of
blocks without dumping everything into a system prompt.

The server lives at `packages/mcp`, publishes as `@uiid/mcp`, and consumers set it up
once: `claude mcp add uiid npx @uiid/mcp`.

---

## Package Structure

```
packages/mcp/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── index.ts                 # Entry point: create server, connect stdio
    ├── utils.ts                 # jsonResponse / errorResponse helpers
    └── tools/
        ├── search-blocks.ts     # Search blocks by query/tags/category/component
        ├── get-block.ts         # Fetch full block by slug
        ├── lookup-component.ts  # Get component props, slots, usage
        └── list-components.ts   # Browse components by category/package
```

---

## Tools

### 1. `search-blocks`

Search blocks by query string, tags, category, or component usage. Returns metadata
only -- not the full tree. This keeps the response lean for discovery.

**Inputs** (all optional):

| Param | Type | Description |
|-------|------|-------------|
| `query` | string | Free-text search across name, description, and tags |
| `tags` | string[] | Filter by tags, OR logic (e.g., `["auth", "login"]`) |
| `category` | string | Filter by category (`authentication`, `forms`, `settings`, `cards`, `content`) |
| `component` | string | Filter by component usage (e.g., `"Button"`, `"Card"`) |

**Logic**: Start with all blocks from `@uiid/blocks`. Apply filters sequentially --
category (exact match), tags (block has at least one matching tag), component (block's
`components` array includes it), query (case-insensitive substring against name,
description, and tags joined).

**Returns**: Array of metadata objects:
```json
{
  "name": "Login with email and Google",
  "slug": "login-email-google",
  "description": "...",
  "tags": ["auth", "login", "sso"],
  "category": "authentication",
  "components": ["Stack", "Group", "Button", "Input"],
  "complexity": "medium",
  "elementCount": 15
}
```

### 2. `get-block`

Fetch a specific block by slug. Returns the full `BlockFile` including the tree, ready
for an LLM to use directly or pass to the playground renderer.

**Input**: `slug` (required)

**Logic**: Look up `blocks[slug]`. If not found, return an error listing available slugs.

**Returns**: Full `BlockFile` (name, slug, description, version, tags, category,
components, complexity, elementCount, tree with root + elements, timestamps).

### 3. `lookup-component`

Get a component's full metadata: props extracted from its Zod schema, slots, defaults,
and usage guidance. This replaces AGENTS.md for external consumers -- prevents LLMs from
hallucinating props.

**Input**: `name` (required, e.g. `"Button"`, `"Card"`)

**Logic**: Look up `registry[name]` (case-insensitive fallback). Extract props via
`generateReference()` from `packages/registry/src/utils/generate-reference.ts`. Augment
with slots, defaults, usage from the `ComponentEntry`.

**Returns**:
```json
{
  "name": "Card",
  "package": "@uiid/cards",
  "category": "cards",
  "description": "...",
  "hasChildren": true,
  "usage": "Use Card for...",
  "slots": {
    "title": "Card heading, rendered above the body",
    "footer": "Footer content at the bottom",
    "action": "Action buttons, top-right",
    "icon": "Icon in the header"
  },
  "defaults": { "shade": "surface" },
  "props": [
    { "name": "shade", "type": "Shade", "required": false, "enumValues": ["surface", "accent", ...] },
    ...
  ]
}
```

### 4. `list-components`

Browse available components. With no filters, returns all components plus available
categories and packages for discoverability.

**Inputs** (all optional):

| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category (`layout`, `buttons`, `forms`, `cards`, etc.) |
| `package` | string | Filter by package (`@uiid/buttons`, `@uiid/forms`, etc.) |

**Logic**: Filter registry entries using `getComponentsByCategory()` or
`getComponentsByPackage()` from manifest. Map to summary objects.

**Returns**: Array of component summaries:
```json
{
  "name": "Button",
  "package": "@uiid/buttons",
  "category": "buttons",
  "description": "Primary action button with multiple size, variant, and tone options.",
  "hasChildren": true
}
```

---

## Build Setup

### Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.1",
    "@uiid/blocks": "workspace:*",
    "@uiid/registry": "workspace:*",
    "zod": "^4.3.6"
  }
}
```

`@uiid/blocks` and `@uiid/registry` are full dependencies (not peer) since the MCP
server is a standalone CLI, not a library consumed by other packages.

### Vite config

Custom config -- not the shared `createViteConfig()` factory. The MCP server is a Node
CLI, not a React library. No React plugin, no CSS handling, no `preserveModules`.

- **Target**: `node20`
- **Workspace packages inlined**: `@uiid/*` NOT in externals, so the CLI is self-contained
- **Runtime deps externalized**: `@modelcontextprotocol/sdk`, `zod`, `node:*` builtins
- **Shebang**: Rollup `banner` option adds `#!/usr/bin/env node`
- **No minification**: keep output readable for debugging

### bin entry

```json
{
  "bin": {
    "uiid-mcp": "./dist/index.js"
  }
}
```

Enables `npx @uiid/mcp` after publishing.

### Build script

```
tsc -b && vite build && chmod +x dist/index.js
```

---

## Key Files to Reuse

| What | Where |
|------|-------|
| `registry` object, `getComponentsByCategory()`, `getComponentsByPackage()` | `packages/registry/src/manifest.ts` |
| `generateReference()` -- LLM-friendly prop docs | `packages/registry/src/utils/generate-reference.ts` |
| `categories` array | `packages/registry/src/categories.ts` |
| `blocks` record, `BlockFile` type | `packages/blocks/src/index.ts`, `packages/blocks/src/types.ts` |

---

## Root Config Changes

- Add `{ "path": "./packages/mcp" }` to root `tsconfig.json` references
- No changes to `pnpm-workspace.yaml` (covered by `packages/*` glob)
- No changes to `turbo.json` (`^build` dependency handles build ordering)

---

## Implementation Order

1. Create `packages/mcp/package.json`, `tsconfig.json`, `vite.config.ts`
2. Create `src/utils.ts` (shared response helpers)
3. Create the 4 tool files under `src/tools/`
4. Create `src/index.ts` (server entry point with stdio transport)
5. Add tsconfig reference to root `tsconfig.json`
6. `pnpm install` + `pnpm build --filter=@uiid/mcp`
7. Test with MCP Inspector

---

## Verification

1. **Build**: `pnpm build --filter=@uiid/mcp`
2. **Shebang**: `head -1 packages/mcp/dist/index.js` outputs `#!/usr/bin/env node`
3. **MCP Inspector**: `npx @modelcontextprotocol/inspector node packages/mcp/dist/index.js`
4. **Tool smoke tests** in inspector:
   - `list-components` (no args) -- all ~40 components
   - `list-components` with `category: "forms"` -- 11 form components
   - `lookup-component` with `name: "Button"` -- full Button docs with props
   - `lookup-component` with `name: "Card"` -- Card with slots
   - `search-blocks` (no args) -- all 9 blocks, metadata only
   - `search-blocks` with `category: "authentication"` -- auth blocks only
   - `get-block` with `slug: "login-email-google"` -- full block with tree
   - `get-block` with `slug: "nonexistent"` -- error with available slugs
5. **Register locally**: `claude mcp add uiid node packages/mcp/dist/index.js`
