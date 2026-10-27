# Spec: `ai-scaffold`

**Module:** `ai-scaffold` (see [capability map](./capability-map.md))
**Package:** `@uiid/ai` (new)
**Status:** Approved

## Objective

Create `@uiid/ai` and register it everywhere a `@uiid/*` package has to be registered, so later modules only add components. Also define the shared structural types that let AI SDK data flow into these components without `@uiid/ai` depending on the `ai` package.

**Acceptance criteria:**

- `pnpm run build --filter=@uiid/ai` produces `dist/index.js` and `dist/index.d.ts`.
- `pnpm test:run packages/ai` discovers and runs the package's tests.
- `@uiid/ai` resolves from source in Vitest and Storybook. Storybook finds packages on its own through `getUiidSourcePackages`, so nothing has to be added for it.
- release-please bumps `packages/ai/package.json` with every other `@uiid/*` package.
- `pnpm size` measures `@uiid/ai` against a `40 kB` limit.
- `@uiid/design-system` re-exports `@uiid/ai` from its barrel.
- No `dist/*.d.ts` mentions the `ai` package.
- `packages/ai/package.json` has `"private": true`, so `pnpm -r publish` skips it until the POC is done.

## Registration points

| #   | File                                                  | Change                                                                                                                                                                                                  |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `packages/ai/package.json`                            | Modeled on `packages/interactive/package.json`. Version `0.7.1`; `"private": true`; `@uiid/*` deps as `workspace:*`; peers `@base-ui/react`, `react`, `react-dom`; devDependency `ai` (drift test only) |
| 2   | `packages/ai/tsconfig.json`                           | Copy of `packages/interactive/tsconfig.json`                                                                                                                                                            |
| 3   | `packages/ai/vite.config.ts`                          | `createViteConfig({ cssLayer: cssLayers.ai })`. `markdown` adds `external: [/^markdown-to-jsx(\/\|$)/]`                                                                                                 |
| 4   | `packages/ai/src/index.ts`, `src/vite-env.d.ts`       | Barrel and CSS-module types                                                                                                                                                                             |
| 5   | `scripts/css-layers.cjs`                              | `ai: "uiid.components"`                                                                                                                                                                                 |
| 6   | `vitest.config.ts`                                    | Add `"ai"` to `uiidPackages`                                                                                                                                                                            |
| 7   | `tsconfig.json`                                       | Add `{ "path": "./packages/ai" }` to `references`                                                                                                                                                       |
| 8   | `release-please-config.json`                          | Add an `extra-files` entry for `packages/ai/package.json`                                                                                                                                               |
| 9   | `.size-limit.json`                                    | Add an `@uiid/ai` entry at `40 kB`. `markdown` and `ai-reasoning-tool` revisit it once `markdown-to-jsx` and `@uiid/code` arrive                                                                        |
| 10  | `packages/design-system/{package.json, src/index.ts}` | Add the dependency and `export * from "@uiid/ai"`                                                                                                                                                       |
| 11  | `packages/design-system/src/globals.css`              | `@import "@uiid/ai/globals.css"`. Added by the first module that ships CSS, since a types-only package emits no stylesheet to import.                                                                   |
| 12  | `README.md`                                           | Add `@uiid/ai` to the package list                                                                                                                                                                      |
| 13  | `.agents/components.md`                               | Fix the new-package checklist: step 5 is out of date (Storybook finds packages on its own), and it's missing rows 7–12 above                                                                            |

`"private": true` does not hide the package from development: Storybook's `getUiidSourcePackages` and Vitest's `uiidPackages` both resolve it from source regardless.

**Final step of the POC, not this module:** remove `"private": true`. Before that, and outside the repo, only you can do it: npm needs a trusted publisher for `@uiid/ai` before the package is first published (`.github/workflows/release.yml:36`).

## Shared types

These go in `packages/ai/src/ai.types.ts`. They are copied from what the POC components read off AI SDK v6's types, as observed in upstream's usage. Each one is structural, so the SDK's own values can be passed in unchanged.

```ts
/** Who authored a message. Matches the AI SDK's `UIMessage["role"]`. */
export type ChatRole = "system" | "user" | "assistant";

/** Lifecycle of a chat request. Matches the AI SDK's `ChatStatus`. */
export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

/** Lifecycle of a tool call. Matches the AI SDK's `ToolUIPart["state"]`. */
export type ToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied";
```

Only types that two or more modules need belong here. `ToolPart` (type, toolName, input, output, errorText) is used only by Tool, so it lives in `ai-reasoning-tool`.

## Files

```
packages/ai/
  package.json
  tsconfig.json
  vite.config.ts
  src/index.ts
  src/vite-env.d.ts
  src/ai.types.ts
  src/ai.types.test.ts
apps/storybook/stories/ai/          (created by the first component module)
```

## Commands

```
pnpm install
pnpm run build --filter=@uiid/ai
pnpm run build --filter=@uiid/design-system
pnpm test:run packages/ai
pnpm run lint && pnpm run format:check
pnpm size
```

## Testing strategy

- `ai.types.test.ts` uses Vitest's `expectTypeOf` to pin each union to its members. A change to a union then fails a test instead of passing silently.
- Drift: assert `expectTypeOf<UIMessage["role"]>().toEqualTypeOf<ChatRole>()` and the same for the other unions against `ai` as a devDependency. That catches drift when the SDK changes. It is a devDependency only, so nothing ships.
- Build check: `grep -r '"ai"' packages/ai/dist` returns nothing.

## Boundaries

- **Always:** copy the `interactive` package's config files; one shared version; `"use client"` stays out of the barrel; keep `"private": true` until the POC's final step.
- **Ask first:** raising the size limit above `40 kB`.
- **Never:** make `ai` a dependency or peer, or publish `@uiid/ai` before the trusted publisher exists.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm run build`, `pnpm test:run`, `pnpm run lint` and `pnpm size` all pass from the repo root.
- The next release-please PR lists `packages/ai/package.json`.

## Resolved decisions

1. **Unpublished during the POC:** `"private": true` until the POC is done. `pnpm -r publish` skips private packages, so a half-built `@uiid/ai` can't ship, and a release can't fail on the missing trusted publisher. Removing the flag is the final step.
2. **Type-drift test:** `ai` is a devDependency, used only by `ai.types.test.ts`.
3. **Size limit:** `40 kB` to start. `markdown` and `ai-reasoning-tool` settle the real number once `markdown-to-jsx` and `@uiid/code`'s shiki arrive (`@uiid/code` alone is limited at 180 kB).
4. **Umbrella re-export:** from the `@uiid/design-system` barrel, like every other package.
5. **`.agents/components.md`:** the checklist fix is in scope (row 13).
