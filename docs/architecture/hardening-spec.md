# Spec: Pre-1.0 hardening

Status: draft for review, 2026-11-18. Plan and tasks: [`tasks/plan.md`](../../tasks/plan.md), [`tasks/todo.md`](../../tasks/todo.md). Delete this file and both task files when the last task merges.

## Objective

Make UIID simpler, smaller and settled before 1.0, working up the dependency path so each layer stands on a finished one. v0.9.0 has shipped and the components are stabilising, so this is the window where breaking removals are cheap.

The work serves two readers. Agent sessions inside this repo should stop being misled by stale docs, dead code and stale build output. Coding agents in consumer apps will later be given READMEs, examples and types as their source of truth, so those have to be correct first. Designing how that material is delivered is a separate, later piece of work.

### Decisions already made

These were settled on 2026-11-18 and are not open for redesign inside a task.

1. **Break freely.** No shims, no deprecation periods. Breaking changes use `!` in the PR title and bump the minor.
2. **Export rule: parts yes, internals no.** Every component exports its composition parts and their prop types, consistently. Constants, variant functions, internal hooks, mocks and `@uiid/utils` plumbing are not exported. A hook stays public only when a public part cannot be used without it, as `useTableSelection` is for a composed Table.
3. **Slot props omit owned keys.** A `*Props` slot type omits the keys the component already takes at the top level, so a conflict is a compile error. Handlers compose and class names merge. **Exit condition:** if this needs conditional or hard-to-read types for a component, stop and instead keep the slot type wide and spread slot props first so top-level values win at runtime, and record which components took the fallback.
4. **Masks live on `Input`.** `Input` takes a `mask` prop. A mask is an imported, self-attaching value built on Maskito. `NumberField` takes no mask. `MaskInput` stays as a thin named wrapper over `Input` with a required `mask`, because a separate component is easier to read at first glance, especially for product teams. All 13 fixed patterns from the old `MaskInput` are rebuilt on the same mask shape, so the library sets the pattern teams will follow when they write their own.
5. **Masked string everywhere.** `value`, `defaultValue`, `onValueChange`, form submission and form libraries all carry the masked string. Apps call `mask.format(n)` going in and `mask.parse(s)` coming out.
6. **Toolchain majors belong to the build work.** TypeScript, Vite, Vitest and `vite-plugin-dts` upgrades are designed together with the build-pipeline changes.
7. **Style props stay as they are.** The `data-ui-*` attribute plus inline `--props-*` variable is a stop-gap until typed CSS `attr()` is broadly available. Do not rework it.

### Out of scope

- How docs reach outside agents (`llms.txt`, docs shipped in npm, skills).
- Agents that generate UI at runtime.
- Merging, splitting or resizing packages.
- Button's render cost and private Tooltip (UI-410) and the Dialog/Drawer and picker duplication (UI-411). Both are in Triage.
- New features, other than the mask prop.
- Larger ideas from the audit that nobody has agreed to: per-component CSS splitting, generating `palette.css` from data, a single size ladder, generating the barrel and docs pages, moving the Tooltip primitive below buttons.

## Tech stack

React 19, TypeScript 5.9 (moving to 7), Vite 7 (moving to 8), Base UI `@base-ui/react` 1.7.0 (moving to 1.9), CSS Modules with design tokens, pnpm workspaces with Turbo, Vitest 4 on happy-dom, Storybook, oxlint and oxfmt. New dependency in step 4: `@maskito/core` and `@maskito/kit` 5.6.x in `@uiid/forms`.

## Commands

| Task               | Command                                         |
| ------------------ | ----------------------------------------------- |
| Install            | `pnpm install`                                  |
| Build all packages | `pnpm run build --filter='./packages/*'`        |
| Build one package  | `pnpm run build --filter=@uiid/{package}`       |
| Tests              | `pnpm test:run`                                 |
| Tests, one package | `pnpm test:run packages/{package}`              |
| Lint               | `pnpm run lint`                                 |
| Format check       | `pnpm run format:check`                         |
| Bundle sizes       | `pnpm size`                                     |
| Storybook build    | `pnpm --filter @uiid/storybook build-storybook` |
| Docs build         | `pnpm run build --filter=docs`                  |

Step 2 adds a root `pnpm typecheck` that needs no prior build.

## Project structure

```
packages/{utils,tokens,icons}                 → base layer, no internal dependencies
packages/{layout,typography}                  → second layer
packages/{buttons,interactive,markdown}       → third layer
packages/{cards,lists,indicators,navigation}  → middle layer
packages/{forms,overlays,code}                → upper layer
packages/{tables,ai}                          → top layer
packages/design-system                        → barrel
apps/{storybook,docs}                         → consumers
.agents/                                      → conventions every session reads
docs/architecture/                            → long-form decisions, including this spec
tasks/                                        → plan.md and todo.md for this work
```

Each component keeps the documented layout: `{name}.tsx`, `.types.ts`, `.variants.ts` where it has variants, `.module.css`, `.test.tsx`, `.examples.tsx`, `README.md`, and `subcomponents/`.

## Code style

A slot type omits what the component owns, and the component passes its own values after the slot spread only where the fallback applies:

```tsx
// dialog.types.ts
export type DialogProps = {
  title?: React.ReactNode;
  size?: DialogSize;
  /** Reaches the popup. `title` and `size` are set on Dialog itself. */
  PopupProps?: Omit<DialogPopupProps, "title" | "size" | "children">;
};

// dialog.tsx
<DialogPopup {...PopupProps} title={title} size={size}>
  {children}
</DialogPopup>;
```

A mask is a plain value with no React in it, and `Input` knows nothing about the engine:

```ts
export type InputMask<T> = {
  attach(element: HTMLInputElement): () => void;
  format(value: T): string;
  parse(masked: string): T;
  inputMode?: "decimal" | "numeric";
};

const usd = currencyMask({ currency: "USD" });

<Input
  mask={usd}
  defaultValue={usd.format(1234.5)}
  onValueChange={(masked) => setAmount(usd.parse(masked))}
/>
```

Conventions that apply throughout: cva for every variant axis, no inline styles, layout primitives over raw flex, mirror the Base UI API, `isRenderable` for "has content" checks, and no hard-wrapped prose in any doc.

## Testing strategy

- **Unit and component tests** stay in Vitest on happy-dom, beside each component. Every behaviour change in this work lands with its test in the same PR. A removal deletes the tests of the removed behaviour and nothing else.
- **Rule changes** get one precedence or type test per component: a `// @ts-expect-error` line proving an owned key cannot be passed through a slot, or a runtime test where the fallback is used.
- **Export changes** are covered by a barrel test per package (`src/index.test.ts`) listing exactly the intended public names. Only ai, design-system, forms and overlays have one today, so the others are created as their layer is reached.
- **Masks** get unit tests for `format` and `parse` per locale (USD, EUR in de-DE, JPY, CHF in de-CH, CAD in fr-CA), a component test proving `Input` wiring with a fake mask, and real-browser tests for caret, paste and blur padding, since happy-dom cannot show them.
- **Build changes** are verified by `scripts/check-dist.mjs`, a before-and-after listing of each package's `dist`, and the timing baseline below.
- **Everything** passes `pnpm test:run`, `pnpm run lint`, `pnpm run format:check`, `pnpm size`, the Storybook build and the docs build before merge.

Baseline measured 2026-11-18 on this machine: a forced full build through Turbo (`pnpm turbo run build --filter='./packages/*' --force`) takes 15.0 s; the same work summed package by package is 48.5 s, of which `tsc -b` is 19.4 s, Vite 26.0 s, and declaration generation inside Vite 10.3 s.

## Boundaries

- **Always:** read the matching `.agents/` chapter before editing; read a component's `.types.ts` before using it; run a repo-wide search before deleting anything called unused; keep each PR to one task; mark breaking PRs with `!`; open the PR before reviewing it.
- **Ask first:** adding any dependency other than Maskito; changing a decision listed above; deleting a composition part or a whole component; changing CI workflows beyond what a task names; anything that changes what is published to npm.
- **Already approved by this spec:** adding `@maskito/core` and `@maskito/kit` to forms and `@vitest/browser-playwright` at the root; the changes to exports, package manifests and published files that a task names; the CI changes that Tasks 10, 12 and 19 name.
- **Never:** add a shim or deprecation path; hand-author a parallel prop schema or registry; rename a Base UI primitive or recast a prop it ships; rework the style-prop double write; propose merging packages; add AI attribution to commits or PRs.

## Success criteria

1. **Deletions.** Until the close-out task removes it, `tasks/` holds only this plan; the three finished-work docs are gone; no tracked build output outside `dist`; no declared dependency that nothing imports, where a package's emitted declarations count as importers, so `cva` stays a dependency of every package that emits variant types (each `*.variants.d.ts` is typed as `import('cva').CVAComponent<…>`, and without its own `cva` dependency that import does not resolve for a consumer under strict resolution and the variant props widen to `any`); no `@deprecated` marker anywhere in `packages/*/src`.
2. **Build.** A fresh clone passes `pnpm install && pnpm test:run` and `pnpm typecheck` with no build step. Vitest and Storybook share one way of resolving `@uiid/*` to source. Each package generates declarations once. A forced full build is no slower than the baseline when both are measured on the same machine. TypeScript, Vite and Vitest are on their current majors, or a named breaking change is recorded as the reason not.
3. **Base UI.** Every package declares the same 1.9.x version in the same form, and each workaround written against 1.7 is removed or justified.
4. **Masks.** `currencyMask`, `percentMask` and `numberMask` work on `Input` as you type, with correct decimals and symbol placement for the five test locales. A cleared field has an empty value. A bundle that renders `Input` with no mask contains no Maskito code. All 13 fixed patterns exist as masks. The old mask hooks and utilities are deleted. Chromium browser tests run in CI, and the README states which platforms are untested.
5. **Rules.** Every component exports its parts and no internals, and `@uiid/design-system` no longer re-exports `@uiid/utils` from its root. No slot type accepts a key its component owns, or the component is listed as using the runtime fallback.
6. **`fullwidth`.** One way to say full width: `w="full"`. The toggle, the Button variant and the composition are gone.
7. **Docs.** Every README and Storybook overview describes only props, parts and tokens that exist, checked against the types.

## Resolved questions

Answered by the owner on 2026-11-18.

1. **Fixed-pattern masks: rebuild all 13.** Being thorough now sets the pattern for future masks and avoids relearning this later.
2. **Drawer's indent parts: delete them.** `DrawerProvider`, `DrawerIndent` and `DrawerIndentBackground` go, along with the README claim. They return when the effect is designed and built.
3. **Hooks that composition needs: public if a part needs it.** Written into decision 2 above.
4. **Sortable and Resizable: ship at 1.0, cleaned up.** Dead code removed, surface trimmed to parts, stories rendering real examples.
5. **Mask browser tests: in CI, Chromium only.** Firefox and WebKit run locally when the binaries are present.
6. **Untested platforms for masks: automated engines only.** Mobile keyboards and IME composition stay untested for now, and the README says so plainly.

## Open questions

1. **Lucide alias names.** Icons re-export Lucide's legacy alias names (about 2,000 names for 1,768 icons). The owner asked for a check first: Task 23 confirms which names Lucide deprecates and how many are used here, and the decision to emit canonical names only is made on that evidence.
