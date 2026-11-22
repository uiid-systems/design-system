# AI Agent Guidelines

UIID is a modular React component library. Follow these conventions to maintain consistency across the codebase.

This file is tool-agnostic and holds only what every session needs. Deeper conventions live in topic chapters under `.agents/`.

**Read the matching chapter before you edit — nothing loads it for you.** The [Chapters](#chapters) table maps file paths to chapters. These are not background reading: they hold the inline-style ban, the required component file layout, and new-package steps that fail silently when skipped. If you are about to change a file and have not opened its chapter this session, open it first.

## Stack

- **React 19** with TypeScript 7
- **Vite 8** for builds
- **Base UI** for accessible primitives — the package is **`@base-ui/react`**, not `@base-ui-components/react`
- **CSS Modules** with design tokens
- **pnpm workspaces** + **Turbo** for monorepo management
- **Vitest** for testing, **Storybook** for documentation
- **oxlint** for linting, **oxfmt** for formatting (both run once from the repo root, not per package)

## Never Guess a Component API

Before using any UIID component, read its `packages/{pkg}/src/{component}/{component}.types.ts`, and its `.variants.ts` where one exists. Props, variants, and sizes change often — do not rely on memorized lists or on what a similar component accepts.

This repo documents itself through working code. Prefer reading a real component over prose: `packages/typography/src/text/` is the complete exemplar (types, CSS module, examples, tests, README). Usage lives in `packages/*/src/*/*.examples.tsx`, docs in `packages/*/src/*/README.md`, stories in `apps/storybook/stories/`, and decisions in `docs/architecture/`.

## Quick Reference

| Task                 | Command                                   |
| -------------------- | ----------------------------------------- |
| Install dependencies | `pnpm install`                            |
| Build all packages   | `pnpm run build`                          |
| Build single package | `pnpm run build --filter=@uiid/{package}` |
| Run tests            | `pnpm test:run`                           |
| Run tests (watch)    | `pnpm test`                               |
| Run tests (one pkg)  | `pnpm test:run packages/buttons`          |
| Typecheck (no build) | `pnpm typecheck`                          |
| Start Storybook      | `pnpm --filter @uiid/storybook dev`       |
| Lint                 | `pnpm run lint`                           |
| Lint and autofix     | `pnpm run lint:fix`                       |
| Format               | `pnpm run format`                         |
| Check formatting     | `pnpm run format:check`                   |
| Check bundle sizes   | `pnpm size`                               |

## Testing

Tests are configured at the **root level** and run across all packages via `vitest.config.ts` and `vitest.setup.ts` (jest-dom matchers). Test files live alongside components as `{component}.test.tsx`.

For patterns — rendering, `data-slot` verification, variant props, user interaction, controlled/uncontrolled state, disabled states, and accessibility — read an existing test rather than working from a template. `packages/typography/src/text/text.test.tsx` and `packages/buttons/src/button/button.test.tsx` are good references.

## Pull Requests & Releases

PR titles follow **conventional commits**, enforced by CI. `.github/workflows/pr-title.yml` is the source of truth for allowed types. Use imperative mood ("add X", not "added X"), and keep titles concise — the squash-merged title becomes the changelog entry.

Descriptions should use bullet points, call out breaking changes explicitly, and link issues with `Closes #123`. Write custom, verifiable checklist items rather than boilerplate — each box should be something an agent can confirm by reading the diff or running a command.

Storybook deploy previews are opt-in: a PR gets one only while it carries the `preview` label (`.github/workflows/storybook-preview.yml`). Never add that label unless the user asks for a preview.

Versioning and changelogs are automated by **release-please**:

- All `@uiid/*` packages share one version, kept in sync via `extra-files`
- **Pre-1.0.0, bumps are patch-only** (`bump-patch-for-minor-pre-major`) — breaking changes bump minor, never major
- `feat` and `fix` trigger a release; `docs`, `chore`, `ci`, `test`, and `refactor` are recorded but do not force one

## Chapters

Find the row matching the files you are touching and read that chapter before editing.

| Chapter                   | Covers                                                               | Read when                     |
| ------------------------- | -------------------------------------------------------------------- | ----------------------------- |
| `.agents/architecture.md` | Monorepo layout, root config files                                   | Touching root configs         |
| `.agents/components.md`   | Component conventions, upstream substitutions, new-package checklist | Touching any component source |
| `.agents/styling.md`      | Inline-style ban, layout primitives, style props, CSS vars           | Touching `.tsx` / `.css`      |

"Any component source" means `packages/**` and `apps/*/components/**` alike. App components follow the same conventions as package components.

## Skills

Skills live in `.claude/skills/uiid/skills/{name}/SKILL.md`. The `uiid` folder is a plugin, so Claude Code lists each skill as `uiid:{name}` and loads one when its description matches the task. With any other tool, read the file when its row applies.

| Skill                   | Covers                                                                                          | Read when                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `uiid:structure-recipe` | Structuring a recipe: several components composed into one piece of an app                      | Creating, moving or splitting files in `apps/*/components/`  |
| `uiid:build-project`    | Building a project's ready Linear tickets in parallel: build agent, local review loop, draft PR | Asked to work the ready tickets in a Linear project          |
| `uiid:review-pr`        | How the Claude Review bot in CI reviews a pull request and the shape of the comment it posts    | Changing what the review bot checks or how its comment reads |
