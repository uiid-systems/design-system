# UIID Vision

> This document is the canonical reference for project direction. It covers the core thesis, architectural decisions, current state, and where things are headed.

---

## The Thesis

Most design systems are component libraries. UIID is a **registry-first design system** — the distinction matters.

A component library gives you building blocks. A registry-first design system gives you building blocks *and* a structured understanding of what those blocks are, what they accept, and how they should be used. That structured understanding — the registry — is what makes the whole system coherent and extensible.

The three layers of UIID are in balance: each has a clear responsibility, and none bleeds into another.

**Tokens** are the design language — values that carry meaning independent of any platform. Currently they output CSS custom properties. The format is spec-aligned so they can be adapted to other targets (Figma variables, native platforms) without changing the source.

**Registry** is the semantic layer — a platform-agnostic description of every component: its props, types, defaults, slots, and intended usage. The React implementation is the first consumer of the registry, not the other way around. Tools and LLMs that need to understand the system read the registry, not the code.

**Blocks** are the composition layer — named, versioned UI patterns built from registry-validated components. They exist because as a design system scales across more apps and teams, the same component combinations get assembled independently and diverge. Blocks prevent that drift by giving patterns a canonical form.

---

## Why Registry-First

The registry solves a problem that grows with the system.

When a design system is small, developers can hold all the components in their head. When it grows to 40+ components with variants, sizes, tones, and slots, that becomes impossible. Developers reach for the wrong component. LLMs hallucinate props. New contributors don't know what's available.

The registry is the answer: a machine-readable, always-current description of the entire system. It's what allows the blocks app to generate accurate UI without guessing prop names. It's what allows documentation to stay in sync with the implementation. It's what an MCP server would expose to give any LLM in any codebase accurate knowledge of the system.

The registry isn't metadata bolted on after the fact — it's the primary interface. Components are the React implementation of what the registry describes.

---

## Blocks

Blocks are saved UI compositions. A login form, a settings panel, a pricing card — patterns that appear repeatedly across products.

Today, blocks are JSON files in `packages/blocks/` with a defined schema. The blocks app (`apps/blocks`) lets you compose interfaces using AI assistance, preview them, and save them to the block registry. Saved blocks are version-controlled and shareable.

The long-term direction: as teams accumulate blocks, the system can recognize when you're composing something that already exists and surface the saved version. Eventually, via MCP or similar tooling, blocks can be delivered directly — "here's the login form your team uses" — rather than rebuilt from scratch each time.

---

## Figma Integration

UIID is designed to work with Figma as a data source, not just as a reference. Using the [figma-console-mcp](https://github.com/glennfaison/figma-console-mcp), tokens and component structures defined in Figma can be used to maintain the design system — keeping design and code in sync from a shared source of truth.

This matters for the future of agentic design systems: an agent that can read from Figma and write to code (or vice versa) needs a stable, structured data layer on both sides. Tokens and the registry provide that layer on the code side. Figma provides it on the design side.

---

## MCP Server

The `@uiid/mcp` package (planned) exposes the registry and blocks to external LLMs via the Model Context Protocol. Once set up, any AI tool in any codebase can:

- Browse available components by category
- Look up a component's props, defaults, and usage without guessing
- Search blocks by query, tag, or component usage
- Fetch a specific block's full tree for direct use

This extends the registry-first approach beyond the monorepo — consumers don't need to read source code to use the system correctly.

See [`docs/architecture/mcp-server.md`](./architecture/mcp-server.md) for the implementation plan.

---

## Token Architecture

Tokens are structured in three tiers:

- **Primitives** — raw values (color palette, spacing scale, type scale)
- **Semantic** — meaningful aliases (shade, tone, globals)
- **Component** — internal component-specific values

The source format is spec-aligned W3C Design Tokens JSON. The CSS adapter generates custom properties from that source. Future adapters (Figma Variables JSON, native) read the same source without changes to the tokens themselves.

See [`docs/architecture/token-architecture.md`](./architecture/token-architecture.md) for the full plan.

---

## Current State

| Layer | Status |
|-------|--------|
| Tokens | Functional. Spec compliance and tier reorganization planned. |
| Components | 40+ React components across 13 packages. Accessible via Base UI primitives. |
| Registry | Implemented. Zod schemas, usage docs, previews for all components. |
| Blocks | Package exists. ~9 blocks. App functional. |
| MCP Server | Planned. Architecture documented. |
| Figma integration | Directional. figma-console-mcp available. |

---

## Decisions Log

**Registry as primary interface, not secondary metadata.**
The registry was built alongside components, not added after. This keeps it accurate and prevents drift between what components do and what the registry says.

**Flat block tree structure optimized for streaming.**
Blocks use a flat `{ root, elements }` format rather than nested JSON. This allows streaming partial trees and avoids deep nesting that becomes hard to parse or manipulate.

**CSS Modules, not a utility framework.**
Styling is done with CSS Modules and design tokens. This keeps the component packages dependency-free and the output predictable.

**Base UI for accessible primitives.**
Rather than implementing ARIA patterns from scratch, interactive components are built on Base UI. This delegates accessibility correctness to a well-tested upstream.

**pnpm workspaces + Turbo for the monorepo.**
Each component category is its own package. Consumers install only what they need.
