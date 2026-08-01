# AI Agent Guidelines

UIID is a modular React component library. Follow these conventions to maintain consistency across the codebase.

This file is tool-agnostic and holds only what every session needs. Topic chapters live in `.agents/` and are symlinked into `.claude/rules/`, where most load on demand when you touch matching files. `CLAUDE.md` imports this file.

## Stack

- **React 19** with TypeScript 5.8
- **Vite 7** for builds
- **Base UI** for accessible primitives — the package is **`@base-ui/react`**, not `@base-ui-components/react`
- **CSS Modules** with design tokens
- **pnpm workspaces** + **Turbo** for monorepo management
- **Vitest** for testing, **Storybook** for documentation
- **oxlint** for linting, **oxfmt** for formatting (both run once from the repo root, not per package)

## Never Guess a Component API

Before using any UIID component, read its `packages/{pkg}/src/{component}/{component}.types.ts` and `.variants.ts`. Props, variants, and sizes change often — do not rely on memorized lists or on what a similar component accepts.

This repo documents itself through working code. Prefer reading a real component over prose: `packages/typography/src/text/` is the complete exemplar (types, variants, CSS module, examples, tests, README). Usage lives in `packages/*/src/*/*.examples.tsx`, docs in `packages/*/src/*/README.md`, stories in `apps/storybook/stories/`, and decisions in `docs/architecture/`.

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
| Lint and autofix     | `pnpm run lint:fix`                       |
| Format               | `pnpm run format`                         |
| Check formatting     | `pnpm run format:check`                   |
| Check bundle sizes   | `pnpm size`                               |

## Chapters

| Chapter                   | Covers                                                               | Loads when                    |
| ------------------------- | -------------------------------------------------------------------- | ----------------------------- |
| `.agents/architecture.md` | Monorepo layout, root config files                                   | Touching root configs         |
| `.agents/components.md`   | Component conventions, upstream substitutions, new-package checklist | Touching `packages/**` source |
| `.agents/styling.md`      | Inline-style ban, layout primitives, CSS vars, spacing               | Touching `.tsx` / `.css`      |
| `.agents/testing.md`      | Test setup and where to look                                         | Touching test files           |
| `.agents/workflows.md`    | PR conventions, release-please                                       | Always                        |
| `.agents/known-issues.md` | Upstream bugs and why tests are skipped                              | Touching `packages/forms/**`  |
