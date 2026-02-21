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
│   ├── docs/          # Documentation site (see apps/docs/CLAUDE.md)
│   ├── playground/    # AI-powered UI generator (see apps/playground/CLAUDE.md)
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

@.claude/guides/components.md
@.claude/guides/styling.md
@.claude/guides/testing.md
@.claude/guides/registry.md
@.claude/guides/storybook.md
