# AI Agent Guidelines

UIID is a modular React component library. Follow these conventions to maintain consistency across the codebase.

This file is tool-agnostic and holds only what every session needs. Deeper conventions live in rule files under `.claude/rules/`.

**Read the matching rule before you edit.** The [Rules](#rules) table maps file paths to rules. These are not background reading: they hold the inline-style ban, the required component file layout, and new-package steps that fail silently when skipped. Claude Code loads a rule on its own when it reads or edits a matching file. With any other tool nothing loads it for you, so open the rule first.

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

This repo documents itself through working code. Prefer reading a real component over prose: `packages/typography/src/text/` is the complete exemplar (types, CSS module, examples, tests, README). Usage lives in `packages/*/src/*/*.examples.tsx`, docs in `packages/*/src/*/README.md`, and stories in `apps/storybook/stories/`.

## Quick Reference

| Task                 | Command                                   |
| -------------------- | ----------------------------------------- |
| Install dependencies | `pnpm install`                            |
| Build all packages   | `pnpm run build`                          |
| Build single package | `pnpm run build --filter=@uiid/{package}` |
| Run tests            | `pnpm test:run`                           |
| Run tests (watch)    | `pnpm test`                               |
| Run tests (one pkg)  | `pnpm test:run packages/buttons`          |
| Run browser tests    | `pnpm test:browser`                       |
| Typecheck (no build) | `pnpm typecheck`                          |
| Start Storybook      | `pnpm --filter @uiid/storybook dev`       |
| Lint                 | `pnpm run lint`                           |
| Lint and autofix     | `pnpm run lint:fix`                       |
| Format               | `pnpm run format`                         |
| Check formatting     | `pnpm run format:check`                   |
| Check bundle sizes   | `pnpm size`                               |

## Testing

Tests run from the **root** across all packages, configured by `packages/config/vitest.config.ts` and `vitest.setup.ts` (jest-dom matchers). Test files live alongside components as `{component}.test.tsx`.

For patterns — rendering, `data-slot` verification, variant props, user interaction, controlled/uncontrolled state, disabled states, and accessibility — read an existing test rather than working from a template. `packages/typography/src/text/text.test.tsx` and `packages/buttons/src/button/button.test.tsx` are good references.

## Pull Requests & Releases

PR titles follow **conventional commits**, enforced by CI. `.github/workflows/pr-title.yml` is the source of truth for allowed types. Use imperative mood ("add X", not "added X"), and keep titles concise — the squash-merged title becomes the changelog entry.

Descriptions should use bullet points, call out breaking changes explicitly, and link issues with `Closes #123`. Write custom, verifiable checklist items rather than boilerplate — each box should be something an agent can confirm by reading the diff or running a command.

Storybook deploy previews are opt-in: a PR gets one only while it carries the `preview` label (`.github/workflows/storybook-preview.yml`). Never add that label unless the user asks for a preview.

Versioning and changelogs are automated by **release-please**:

- All `@uiid/*` packages share one version, kept in sync via `extra-files`
- **Pre-1.0.0, bumps are patch-only** (`bump-patch-for-minor-pre-major`) — breaking changes bump minor, never major
- `feat` and `fix` trigger a release; `docs`, `chore`, `ci`, `test`, and `refactor` are recorded but do not force one

## Rules

Find the row matching the files you are touching and read that rule before editing. Each file names the paths it applies to in its `paths:` frontmatter.

| Rule                            | Covers                                                                     | Read when                                                   |
| ------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `.claude/rules/architecture.md` | Monorepo layout, root config files                                         | Touching root configs                                       |
| `.claude/rules/components.md`   | Component conventions, upstream substitutions, new-package checklist       | Touching any component source                               |
| `.claude/rules/styling.md`      | Inline-style ban, layout primitives, style props, CSS vars                 | Touching `.tsx` / `.css`                                    |
| `.claude/rules/recipes.md`      | Structuring a recipe: several components composed into one piece of an app | Creating, moving or splitting files in `apps/*/components/` |
| `.claude/rules/size-limit.md`   | What the size check measures, how PRs are compared, when it fails          | Touching `.size-limit.js` or the size comparison            |

"Any component source" means `packages/**` and `apps/*/components/**` alike. App components follow the same conventions as package components.

## Skills

Skills come from the `uiid` plugin, which lives in the public [`uiid-systems/skills`](https://github.com/uiid-systems/skills) repo. `.claude/settings.json` pins its `uiid-skills` marketplace to a release tag and enables `uiid@uiid-skills`, so Claude Code lists each skill as `uiid:{name}` and loads one when its description matches the task. To move to a newer release, change the `ref` there and in `claude-review.yml`. With any other tool, read `plugins/uiid/skills/{name}/SKILL.md` in that repo, at the pinned tag, when its row applies.

| Skill                       | Covers                                                                                                                            | Read when                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `uiid:build-project`        | Building a project's ready Linear tickets in parallel: build agent, local review loop, draft PR                                   | Asked to work the ready tickets in a Linear project                                   |
| `uiid:graph-linear-project` | Showing a Linear project's open tickets in dependency order: a diagram in the project graph pane, or a linked list in chat        | Asked to show or list a project's tickets, blockers and gates                         |
| `uiid:review-pr`            | Reviewing a pull request with the agent-skills reviewers, locally or as the Claude Review bot in CI, and the shape of the comment | Asked to review a PR, or changing what the review bot checks or how its comment reads |
| `uiid:triage-findings`      | Sorting a posted review's open findings, from CI or a local review, into fix now or defer, and stopping the fix-review loop       | A review round has landed on a PR and findings are about to be fixed                  |
