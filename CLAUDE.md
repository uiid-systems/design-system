# AI Agent Guidelines

UIID is a modular React component library. Follow these conventions to maintain consistency across the codebase.

## Stack

- **React 19** with TypeScript 5.8
- **Vite 7** for builds
- **Base UI** (`@base-ui-components/react`) for accessible primitives
- **CSS Modules** with design tokens
- **pnpm workspaces** + **Turbo** for monorepo management
- **Vitest** for testing, **Storybook** for documentation

## Monorepo Structure

```
design-system/
├── apps/
│   ├── docs/          # Documentation site
│   ├── blocks/        # AI-powered UI composer
│   └── storybook/     # Component documentation
├── packages/          # Component packages (@uiid/*)
│   ├── buttons/, cards/, forms/, layout/, typography/, ...
│   ├── registry/      # Component metadata for AI tools
│   └── tokens/        # Design tokens (JSON → CSS)
├── scripts/           # Token generation, changelog, registry scripts
├── .claude/
│   ├── guides/        # Detailed guides (imported below)
│   └── templates/     # Code templates for components, tests, stories, registry entries
└── docs/
    └── architecture/  # Architecture decision docs (token system, MCP server)
```

## Root Config Files

| File               | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `vite.config.ts`   | Shared Vite build config factory            |
| `vitest.config.ts` | Test configuration for all packages         |
| `vitest.setup.ts`  | Test setup (jest-dom matchers)              |
| `tsconfig.json`    | Base TypeScript config (packages extend it) |
| `turbo.json`       | Turbo task orchestration                    |
| `eslint.config.js` | Shared ESLint configuration                 |

## Attribution Policy

- **Never add yourself as co-author.** Do not include `Co-Authored-By` trailers in commit messages.
- **Never add AI attribution.** Do not include "Generated with Claude Code", "Built by AI", or any similar credit in PR descriptions, code comments, changelogs, or any output.
- The repo owner maintains sole authorship of all commits and artifacts.

## Quick Reference

| Task                 | Command                                   |
| -------------------- | ----------------------------------------- |
| Install dependencies | `pnpm install`                            |
| Build all packages   | `pnpm run build`                          |
| Build single package | `pnpm run build --filter=@uiid/{package}` |
| Run tests            | `pnpm test:run`                           |
| Run tests (watch)    | `pnpm test`                               |
| Start Storybook      | `pnpm run storybook`                      |
| Lint                 | `pnpm run lint`                           |

---

## Core Guides (always loaded)

@.claude/guides/registry.md

## On-Demand Guides

Read these files when the task requires them — do not import by default:

| Guide | Read when... |
| ----- | ------------ |
| `.claude/guides/components.md` | Building, modifying, or reviewing components |
| `apps/blocks/COMPONENT_REFERENCE.md` | Looking up component props for block tree generation (registry subset only) |
| Component `.types.ts` files | **Using UIID components in any code** — always read the component's types file before using props, variants, or sizes. Never guess. |
| `.claude/guides/styling.md` | Working with styles, layout, CSS modules, or design tokens |
| `.claude/guides/testing.md` | Writing or reviewing tests |
| `.claude/guides/storybook.md` | Creating or updating stories |
| `.claude/guides/figma.md` | Building or inspecting Figma components |
| `.claude/guides/pull-requests.md` | Creating a PR |
| `.claude/guides/pull-reviews.md` | Reviewing a PR |
| `apps/blocks/BLOCKS_GUIDE.md` | Working on the blocks app (tree format, rules, patterns) |
| `apps/docs/DOCS_GUIDE.md` | Working on the documentation site |
