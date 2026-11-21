# Tasks: Pre-1.0 hardening

The plan is in [`plan.md`](./plan.md) and the spec in [`docs/architecture/hardening-spec.md`](../docs/architecture/hardening-spec.md). Before starting a task, read the spec's "Decisions already made" and "Boundaries", plus the `.agents/` chapter for the files you will touch.

Each task is tracked as an issue in the Linear project "Pre-1.0 hardening"; its identifier follows the task title, and each phase is a milestone there.

Every task also clears the standing bar: `pnpm test:run`, `pnpm run lint` and `pnpm run format:check` pass, and one PR carries one task. File lists come from the 2026-11-18 audit; rerun the search before deleting, since line numbers drift.

Sizes: S is 1 to 2 files, M is 3 to 5, L is 5 to 8. Tasks marked "mechanical" touch more files than that because they repeat one change; they are still one reviewable idea.

## Phase 1: Low-risk deletions

### Task 1: Delete finished-work docs and fix the references to them (UI-413)

**Description:** Remove the three architecture docs that record completed work, repoint the code comments that cite them, and correct the dependency-graph doc.

**Acceptance criteria:**

- [ ] `docs/architecture/forms-alignment-audit.md`, `token-staleness-audit.md` and `ui-194-list-and-option-theming.md` are deleted, and no file in the repo references them
- [ ] The rationale that `input.types.ts` cites from the forms audit is written inline where it is used
- [ ] `component-dependency-graph.md` no longer shows a `forms → overlays` edge, and its regenerate script ignores CSS comments

**Verification:**

- [ ] `git grep -n "forms-alignment-audit\|token-staleness-audit\|ui-194-list" -- . ':!tasks' ':!docs/architecture/hardening-spec.md'` returns nothing
- [ ] Storybook build passes

**Dependencies:** None

**Files likely touched:** the three docs, `scripts/check-palette-contrast.mjs`, `packages/tokens/src/palette.css`, `packages/forms/src/input/input.types.ts`, `docs/architecture/component-dependency-graph.md`

**Estimated scope:** M

### Task 2: Delete tracked files that nothing imports (UI-414)

**Description:** Remove files that are tracked in git but imported by nothing.

**Acceptance criteria:**

- [ ] `packages/forms/vitest.setup.{js,d.ts,d.ts.map}` are deleted
- [ ] The four root copies in `apps/storybook/stories/tokens/` (`index.ts`, `SectionHeader.tsx`, `TokenTable.tsx`, `TokenVisual.tsx`) are deleted; `subcomponents/` stays
- [ ] `resizable.constants.ts` and the package mocks nothing imports (`accordion.mocks.tsx`, `tabs.mocks.tsx`, `timeline.mocks.ts`) are deleted, and the Storybook copies of `sortable.mocks.ts` and `table.mocks.tsx` are replaced by imports of the package ones

**Verification:**

- [ ] `pnpm test:run` passes and the Storybook build passes
- [ ] For each deleted file, a repo-wide search for its basename shows no importer

**Dependencies:** None

**Files likely touched:** the files named above, plus the stories that import mocks

**Estimated scope:** M

### Task 3: Remove unused dependencies and dead config (UI-415)

**Description:** Drop declared dependencies that nothing imports and config entries that match nothing.

**Acceptance criteria:**

- [ ] `cva` stays declared in every package that emits variant types, since their declarations name it and `scripts/check-dist.mjs` fails on an undeclared import (UI-451); `vite-tsconfig-paths` is removed from the root config and every manifest; `react-dom` is no longer a peer of utils or icons; tokens no longer declares `react`, `@types/react` or `nodemon`, and its `watch` script is gone
- [ ] Duplicate or unused entries are removed: indicators' dev `@uiid/icons`, code's four packages listed in both dependency blocks, Storybook's `@vitest/coverage-v8`, and `@mdx-js/react` in the docs app if the docs build passes without it
- [ ] Dead config is removed: the `preserveDirectives: true` in tables' Vite config, which restates the default (layout and utils set `false`, which is not the default, and keep it), ai's `markdown-to-jsx` external, Turbo's `build/**` output, Vitest's `apps/**/__tests__` include, the commented-out Storybook addon, and the husky migration in `scripts/postinstall.mjs`

**Verification:**

- [ ] `pnpm install` leaves no unexpected lockfile additions; `pnpm run build --filter='./packages/*'` passes
- [ ] `node scripts/check-dist.mjs` and `pnpm size` pass; docs build passes

**Dependencies:** None

**Files likely touched:** package manifests (mechanical), `vite.config.ts`, `packages/tokens/vite.config.ts`, `packages/tables/vite.config.ts`, `turbo.json`, `vitest.config.ts`, `apps/storybook/.storybook/main.ts`, `scripts/postinstall.mjs`

**Estimated scope:** L, mechanical

### Task 4: Delete internal dead code (UI-416)

**Description:** Remove code that nothing reads and that is not part of any public API. Every item below was re-checked against the source on 2026-11-19.

**Acceptance criteria:**

- [ ] Timeline: the `status` axis of `timelineMarkerVariants` (it maps to classes that do not exist; the CSS keys on `data-status`), the base-only `timelineItemVariants` wrapper, and the unread `ROOT_NAME` and `TIME_NAME` constants are removed
- [ ] `.group { display: flex }` is removed (Box already declares it), Avatar no longer references the non-existent `avatar-container` class, and the commented-out rule in `toggle-group.module.css` is gone
- [ ] The docs app's unused `SITEMAP` constant and `SidebarSearch` component are removed

**Verification:**

- [ ] `pnpm test:run packages/{layout,indicators,forms}` passes with no test edited
- [ ] Storybook and docs builds pass; Timeline, Avatar and Group stories look unchanged

**Dependencies:** None

**Files likely touched:** `packages/indicators/src/timeline/timeline.{variants,constants}.ts` and its callers, `packages/layout/src/group/group.module.css`, `packages/indicators/src/avatar/subcomponents/avatar-container.tsx`, `packages/forms/src/toggle-group/toggle-group.module.css`, `apps/docs/sitemap.ts`, `apps/docs/components/shell/sidebar.tsx`

**Estimated scope:** L, small edits in each

### Task 5: Remove unused public API (UI-417)

**Description:** Remove exported things that have no reader and no working behaviour behind them. Unlike Tasks 1 to 4 this is a breaking change, so the PR title carries `!`.

`flatCursor` on Sortable and `formatHeader` on Table are **not** part of this task. Nothing in the repo passes them, but both are documented public props that work, and they stay.

**Acceptance criteria:**

- [ ] `DrawerProvider`, `DrawerIndent` and `DrawerIndentBackground` are deleted, with the README section that describes the page scaling down; `DrawerTitleProps` and `DrawerDescriptionProps`, which have no matching component, are deleted
- [ ] The three tokens nothing reads are removed from the token JSON: `--globals-shadow-md`, `--forms-font-size` and `--forms-padding-x`
- [ ] CodeEditor no longer renders an unstyled `Loading...` div while the highlighter starts

**Verification:**

- [ ] `pnpm test:run packages/{tokens,overlays,code}` passes
- [ ] `git grep -n "shadow-md\|forms-font-size\|forms-padding-x\|DrawerIndent\|DrawerProvider" -- packages apps` finds nothing in source
- [ ] Storybook and docs builds pass

**Dependencies:** None

**Files likely touched:** `packages/overlays/src/drawer/` (three subcomponents, types, index, README), `packages/tokens/src/json/` (two files), `packages/code/src/code-editor/code-editor.tsx`

**Estimated scope:** L

### Task 6: Correct the always-loaded agent docs (UI-418)

**Description:** Fix the files every session reads, so later tasks start from true statements.

**Acceptance criteria:**

- [ ] `AGENTS.md` states the TypeScript version actually in use; `.agents/architecture.md` no longer lists a theming guide that does not exist and says where token generation lives; `.agents/components.md` no longer says Badge renders Status
- [ ] The root `README.md` usage example compiles and its dev-mode instruction matches the scripts that exist
- [ ] `apps/storybook/stories/agent-guidelines.mdx` still imports files that exist

**Verification:**

- [ ] After a full package build, a scratch story containing the README example passes Storybook's typecheck; delete the scratch story afterwards
- [ ] Storybook build passes

**Dependencies:** None

**Files likely touched:** `AGENTS.md`, `.agents/architecture.md`, `.agents/components.md`, `README.md`

**Estimated scope:** M

## Phase 2: Build pipeline

### Task 7: Read the toolchain changelogs and record what breaks (UI-419)

**Description:** Read the release notes for TypeScript 7, Vite 8, Vitest 5 and `vite-plugin-dts` 5 from their official sources, and write down what affects this repo. No code changes.

**Acceptance criteria:**

- [ ] The spec gains a short "Toolchain upgrades" section listing, per tool, the breaking changes that apply here and whether the upgrade is clean
- [ ] Each claim cites its source
- [ ] The section says whether Tasks 13 and 14 can proceed as planned or need reordering

**Verification:**

- [ ] Every listed breaking change points at a file or config in this repo that it affects

**Dependencies:** None

**Files likely touched:** `docs/architecture/hardening-spec.md`

**Estimated scope:** S

### Task 8: Prove source resolution on two packages (UI-420)

**Description:** Add a custom export condition pointing at source to `@uiid/utils` and `@uiid/layout`, and make Vitest, Storybook and a root typecheck resolve those two through it. This is the high-risk step, done small first.

**Acceptance criteria:**

- [ ] Both packages export their `src/index.ts` under a custom condition, and the published `exports` for consumers are unchanged
- [ ] With both packages' `dist` deleted, layout's tests pass, a root `tsc --noEmit` over layout passes, and Storybook renders a layout story
- [ ] The PR states plainly whether the approach holds, including any conflict with `composite` or `rootDir`, and the fallback if it does not

**Verification:**

- [ ] `rm -rf packages/{utils,layout}/dist && pnpm test:run packages/layout`
- [ ] `npm pack --dry-run` in both packages lists the same files as before

**Dependencies:** Task 3

**Files likely touched:** two `package.json` files, `vitest.config.ts`, `apps/storybook/.storybook/main.ts`, a new root `tsconfig.check.json`

**Estimated scope:** M

### Task 9: Roll source resolution out and delete the alias tables (UI-421)

**Description:** Apply the proven condition to every package and remove the hand-written alias tables.

**Acceptance criteria:**

- [ ] Every package exposes source under the condition
- [ ] The `@uiid/*` regex aliases are gone from `vitest.config.ts` and from Storybook's `viteFinal`
- [ ] Storybook no longer loads each package's CSS twice

**Verification:**

- [ ] With every `packages/*/dist` deleted except tokens and icons output, `pnpm test:run` passes and Storybook builds
- [ ] `node scripts/check-dist.mjs` passes after a full build

**Dependencies:** Task 8

**Files likely touched:** package manifests (mechanical), `vitest.config.ts`, `apps/storybook/.storybook/main.ts`

**Estimated scope:** L, mechanical

### Task 10: Add a build-free `pnpm typecheck` and run it in CI (UI-422)

**Description:** One root typecheck over packages, Storybook and the docs app, with no build first.

**Acceptance criteria:**

- [ ] `pnpm typecheck` passes on a clone with no `dist` folders
- [ ] It covers `apps/docs`, which CI does not typecheck today
- [ ] CI runs it on every PR

**Verification:**

- [ ] Introduce a deliberate type error in a package and in the docs app; both fail the command

**Dependencies:** Task 9

**Files likely touched:** `tsconfig.check.json`, root `package.json`, one workflow file, `AGENTS.md` quick reference

**Estimated scope:** M

### Task 11: Generate declarations once per package (UI-423)

**Description:** Follow the icons package: `tsc` emits declarations only, Vite stops emptying `dist`, and `vite-plugin-dts` is removed. Share one base tsconfig between packages.

**Acceptance criteria:**

- [ ] `vite-plugin-dts` is not a dependency anywhere
- [ ] The emit settings the 15 identical package tsconfigs repeat (`outDir`, declaration-only emit, test exclusion) move into one shared file they extend
- [ ] No test declarations or declaration maps are published

**Verification:**

- [ ] For every package, `npm pack --dry-run` lists the same `.d.ts` files as before, minus intended removals
- [ ] `pnpm turbo run build --filter='./packages/*' --force` is timed before and after on the same machine; both figures go in the PR

**Dependencies:** Task 10

**Files likely touched:** `vite.config.ts`, package tsconfigs (mechanical), a new shared tsconfig, package manifests

**Estimated scope:** L, mechanical

### Task 12: Make a fresh worktree run tests and Storybook without a build (UI-424)

**Description:** Remove the remaining reasons a new checkout needs `pnpm run build` first.

**Acceptance criteria:**

- [ ] Vitest's global setup generates the token CSS as well as the icons
- [ ] Storybook starts on a checkout with no package `dist` folders
- [ ] CI's separate "Generate tokens" step is removed

**Verification:**

- [ ] In a new git worktree: `pnpm install && pnpm test:run` passes, and `pnpm --filter @uiid/storybook dev` serves a story

**Dependencies:** Task 9

**Files likely touched:** `vitest.globalSetup.ts`, `apps/storybook/.storybook/main.ts`, one workflow file

**Estimated scope:** M

### Task 13: Move the build toolchain to the root and upgrade Vite and Vitest (UI-425)

**Description:** Declare Vite, the React plugin and Vitest once at the root, then take them to their current majors. `@testing-library/jest-dom` 8 comes with Vitest 5, because it is the release that supports it. The breaking changes are listed under "Toolchain upgrades" in the spec.

**Acceptance criteria:**

- [ ] The build toolchain is declared in the root manifest only
- [ ] Vite and Vitest are on their current majors, or the spec records the specific breaking change that prevents it
- [ ] The React SWC plugin is removed from library builds if the built output is unchanged without it
- [ ] `build.cssTarget` is set so built CSS keeps `light-dark()`, in library builds and Storybook
- [ ] `@testing-library/jest-dom` is on 8.x, tsconfig `types` lists `@testing-library/jest-dom/vitest`, and `vitest.matchers.d.ts` declares `Assertion<R, T>`

**Verification:**

- [ ] Full build, `pnpm test:run`, `pnpm size`, Storybook and docs builds pass
- [ ] `node scripts/check-dist.mjs` passes; `"use client"` is still the first line of every module that had it
- [ ] Every built package stylesheet that had `light-dark()` still has it, and none contains `--lightningcss-`

**Dependencies:** Tasks 7 and 11

**Files likely touched:** root and package manifests (mechanical), `vite.config.ts`, `vitest.config.ts`, `vitest.matchers.d.ts`, package and Storybook tsconfigs, `apps/storybook/.storybook/main.ts`

**Estimated scope:** L, mechanical

### Task 14: Upgrade TypeScript to 7 (UI-426)

**Description:** Take the compiler to its current major on its own, so any change in emitted types is isolated.

**Acceptance criteria:**

- [ ] `typescript` is on 7.x everywhere, with one `@types/react` version across all workspace importers
- [ ] `pnpm typecheck` and the full build pass
- [ ] Nothing calls the TypeScript 5 JavaScript API: `ts.preProcessFile` is replaced in `scripts/dts-relative-extensions.mjs` and `packages/design-system/src/package-dependencies.test.ts`, or `typescript` is aliased to `@typescript/typescript6` with the native compiler alongside. The alias conflicts with "7.x everywhere", so the owner rules on it here
- [ ] `packages/icons/tsconfig.build.json` sets `rootDir`
- [ ] The docs props table (`react-docgen-typescript`) has a recorded decision: the alias, waiting for the 7.1 API, or staying on 5.9
- [ ] If the upgrade is not viable, the spec records why and the repo stays on 5.9

**Verification:**

- [ ] Diff each package's emitted `.d.ts` against the previous build and explain every difference in the PR
- [ ] Docs build passes against the new declarations, and a docs page still renders its props table

**Dependencies:** Tasks 7 and 13

**Files likely touched:** manifests, lockfile, tsconfigs, `scripts/dts-relative-extensions.mjs`, `packages/design-system/src/package-dependencies.test.ts`, `apps/docs/components/docs/props-table.tsx`

**Estimated scope:** M

### Task 15: Upgrade the remaining majors (UI-427)

**Description:** Shiki 4, size-limit 14, commitlint 21 and `@types/node` 26. `@testing-library/jest-dom` 8 moved to Task 13.

**Acceptance criteria:**

- [ ] Each is on its current major, or its blocker is recorded
- [ ] Code highlighting output is unchanged for the bundled languages and themes
- [ ] `pnpm size` limits still hold

**Verification:**

- [ ] `pnpm test:run packages/code`, including the lazy-loading test
- [ ] A commit with an invalid scope is still rejected by the hook

**Dependencies:** Task 13

**Files likely touched:** manifests, `.size-limit.js`, `packages/code/src/highlighter/`

**Estimated scope:** M

## Phase 3: Base UI

### Task 16: Bump Base UI to 1.9 and remove the 1.7 workarounds (UI-412)

**Description:** UI-412. Unify how the version is declared and take it to 1.9.x, deleting what the newer version makes unnecessary.

**Acceptance criteria:**

- [ ] Every package declares the same `@base-ui/react` 1.9.x in the same form
- [ ] The hand-added `aria-modal` on CodeBlock and the two skipped Radio tests are each removed or kept with a stated reason; Dialog, Drawer and CodeBlock agree on `aria-modal`
- [ ] The PR lists the behaviour changes found in the 1.8 and 1.9 changelogs

**Verification:**

- [ ] `pnpm test:run` passes with no new skips
- [ ] Storybook build passes; overlays open, trap focus and close in a manual check

**Dependencies:** Phase 2 checkpoint

**Files likely touched:** package manifests (mechanical), `packages/code/src/code-block/code-block.tsx`, `packages/forms/src/radio/radio.test.tsx`, `packages/forms/src/radio-group/radio-group.test.tsx`

**Estimated scope:** M

## Phase 4: Input masks

The tested prototype is on the owner's machine in a folder named `mask-proof` next to the main checkout of this repo (not next to a worktree) (`src/masks.final.ts`, `src/input.final.tsx`, `tests/`). It is not in version control; run `npm install` there before `sh run-all.sh`.

### Task 17: Add the `mask` prop and `InputMask` type to `Input` (UI-428)

**Description:** Give `Input` a `mask` prop that attaches a self-contained mask value from a ref callback. No engine code enters `Input`.

**Acceptance criteria:**

- [ ] `InputMask<T>` is exported with `attach`, `format`, `parse` and optional `inputMode`
- [ ] `Input` calls `mask.attach(element)` on mount and its cleanup on unmount, on mask change and under StrictMode's double mount; `inputMode` comes from the mask unless the caller sets it
- [ ] `Input` imports nothing from Maskito

**Verification:**

- [ ] Component tests with a fake mask cover attach, cleanup, swap and StrictMode
- [ ] `pnpm test:run packages/forms/src/input` passes

**Dependencies:** Task 16

**Files likely touched:** `packages/forms/src/input/input.tsx`, `input.types.ts`, the input control subcomponent, `input.test.tsx`

**Estimated scope:** M

### Task 18: Add `currencyMask`, `percentMask` and `numberMask` (UI-429)

**Description:** The three numeric mask factories on Maskito, with the four additions the browser proof found necessary.

**Acceptance criteria:**

- [ ] Currency symbol, symbol side and decimal count come from `Intl.NumberFormat`; `format` and `parse` round-trip for USD, EUR in de-DE, JPY, CHF in de-CH and CAD in fr-CA; `parse` returns `null` for an empty field
- [ ] The four behaviours hold: writes are visible to React so `onValueChange` sees every rewritten value; a field with no digits has an empty value; the caret cannot enter a trailing symbol; decimals pad on blur and not while typing
- [ ] Maskito is imported only inside the mask module and is never re-exported; a size-limit entry proves a no-mask `Input` bundle contains none of it

**Verification:**

- [ ] Unit tests per locale for `format` and `parse`; a dedicated test for the React-visibility wrapper
- [ ] `pnpm size` passes with the new entry

**Dependencies:** Task 17

**Files likely touched:** a new `packages/forms/src/input/masks/` directory, `packages/forms/package.json`, the forms barrel, `.size-limit.js`

**Estimated scope:** M

### Task 19: Add real-browser tests for masks (UI-430)

**Description:** Scripted browser checks for what happy-dom cannot show, ported from the prototype's Playwright scripts, running in Chromium in CI.

**Acceptance criteria:**

- [ ] Tests cover typing with grouping, deletion across a separator, select-and-replace, real clipboard paste, blur padding, clearing to empty, and End and Backspace beside a trailing symbol
- [ ] A browser test project runs them in Chromium on every PR, with `@vitest/browser-playwright` added at the root (today only Storybook declares it)
- [ ] The same suite can be pointed at Firefox and WebKit locally when those binaries are installed

**Verification:**

- [ ] The suite passes, and fails when the caret guard or the empty-value postprocessor is removed
- [ ] The CI run shows the browser job on the PR

**Dependencies:** Task 18

**Files likely touched:** a new browser test file, `vitest.config.ts`, one workflow file

**Estimated scope:** M

### Task 20a: Rebuild the 13 fixed patterns as masks (UI-431)

**Description:** Port every fixed pattern from the old `MaskInput` to the `InputMask` shape, through one `patternMask` factory that teams can also use for their own masks. The patterns are phone, SSN, EIN, date, time, credit card, credit card expiry, zip code, extended zip code, licence plate, IPv4, MAC address and ISBN.

**Acceptance criteria:**

- [ ] A `patternMask` factory builds a mask from a template, and all 13 patterns are exported as masks built with it or, where a template cannot express them (IPv4 has variable-length groups), with a short custom definition
- [ ] Each mask's `parse` returns the unmasked string and `format` round-trips it; the existing validators (card checksum, real expiry month, date ranges) are exported as plain functions that work with Field's `validate`
- [ ] Importing one pattern does not bundle the others

**Verification:**

- [ ] Unit tests per pattern for `format`, `parse` and the validator, carrying over the cases from the old test file
- [ ] Browser tests from Task 19 gain one fixed-pattern case for typing, deleting across a literal and paste

**Dependencies:** Tasks 18 and 19

**Files likely touched:** `packages/forms/src/input/masks/` (one small file per pattern), the forms barrel

**Estimated scope:** L, one idea repeated per pattern

### Task 20b: Retire the old `MaskInput` engine and keep `MaskInput` as a wrapper (UI-432)

**Description:** Delete the hand-written engine now that every pattern has a replacement. `MaskInput` stays as a thin named component over `Input`, because a separate component reads more clearly at first glance, especially for product teams.

**Acceptance criteria:**

- [ ] `mask-input/hooks/`, `mask-input/utils/` and `mask-input/patterns/` are deleted
- [ ] `MaskInput` renders `Input` and adds nothing else: its `mask` prop is required and takes an `InputMask`, the string keys such as `mask="phone"` are gone, and every other prop is `Input`'s
- [ ] `validationMode`, `onValidate` and the dual-argument `onValueChange` no longer exist
- [ ] The story, examples, docs page and README show `MaskInput` with imported masks, and say that `Input` with a `mask` is the same thing

**Verification:**

- [ ] `pnpm test:run packages/forms` passes with no skipped tests
- [ ] Storybook and docs builds pass; `mask-input.tsx` imports nothing from Maskito and holds no state or handlers

**Dependencies:** Task 20a

**Files likely touched:** `packages/forms/src/mask-input/` (deletions and a rewritten `mask-input.tsx` and types), the forms barrel, one story, one docs page

**Estimated scope:** L, mostly deletions

### Task 21: Document masks and state what is untested (UI-433)

**Description:** Write the README section a consumer needs, including how to author a mask, and say plainly which platforms have not been tested.

**Acceptance criteria:**

- [ ] The Input README explains the value contract (masked string everywhere, `format` in and `parse` out), with examples for currency, percent, number and one fixed pattern, a react-hook-form example, and the notes that percent parses `50%` as 50 and that pasted numbers are read in the field's locale
- [ ] It shows how to write a custom mask with `patternMask`
- [ ] It records what was tested (Chromium in CI; Firefox and WebKit from a local run, with the date) and states that mobile keyboards and IME composition are untested

**Verification:**

- [ ] Every README example exists in `input.examples.tsx` and renders in Storybook
- [ ] The Firefox and WebKit run is attached to the PR, or the README says those engines are untested too

**Dependencies:** Task 20b

**Files likely touched:** `packages/forms/src/input/README.md`, `input.examples.tsx`, one story

**Estimated scope:** M

## Phase 5: Rules, layer by layer

For every task in this phase: parts and their prop types are exported; constants, variant functions, internal hooks, mocks and plumbing are not. A slot type omits the keys its component owns. If that needs conditional types, use the runtime order for that component and add it to the fallback list in `.agents/components.md`. Each task gives its packages a barrel test (`src/index.test.ts`) listing the exact public names, creating one where it is missing: only ai, design-system, forms and overlays have one today. Each task also builds Storybook and the docs app, and its PR title carries `!`.

### Task 22: Write both rules into `.agents/components.md` and stop the barrel re-exporting utils (UI-434)

**Description:** Record the two rules where every session reads them, and remove `export * from "@uiid/utils"` from the root of `@uiid/design-system`.

**Acceptance criteria:**

- [ ] `.agents/components.md` states the export rule and the slot rule, with the exit condition and an empty fallback list
- [ ] The design-system root no longer re-exports utils; the `./utils` subpath serves a curated list
- [ ] Apps and stories that imported a utils name from the root import it from the subpath

**Verification:**

- [ ] Storybook and docs builds pass
- [ ] `scripts/check-package-registration.mjs` passes

**Dependencies:** Task 16

**Files likely touched:** `.agents/components.md`, `packages/design-system/src/index.ts`, its utils entry, a few stories

**Estimated scope:** M

### Task 23: Apply the export rule to utils, tokens and icons (UI-435)

**Description:** Curate the public surface of the base layer.

**Acceptance criteria:**

- [ ] utils exports only what a consumer writes; the prop-key arrays, option types and `composeRefs` are internal; icons no longer exports `createLucideIcon`, which nothing outside the package uses
- [ ] `VariantProps` stays public, because the published `*.types.d.ts` files import it
- [ ] tokens' unused package export paths are removed and its published files exclude tests; `paletteAnchor` moves to Storybook
- [ ] The PR records which alias names Lucide itself deprecates and how many alias names this repo uses, so the owner can decide whether icons emit canonical names only; no icon names change in this task, and if the answer is yes it becomes a new task

**Verification:**

- [ ] Full build passes, which proves no other package imported a removed name
- [ ] Barrel tests list the exact public names

**Dependencies:** Task 22

**Files likely touched:** `packages/utils/src/index.ts`, `packages/tokens/package.json`, `packages/tokens/src/index.ts`

**Estimated scope:** M

### Task 24: Apply both rules to layout, typography, buttons, interactive and markdown (UI-436)

**Description:** Second and third layers.

**Acceptance criteria:**

- [ ] The streaming hooks, their utilities and tests move from typography into `@uiid/markdown`, their only consumer
- [ ] Button's internal types and Sortable's internal hooks are no longer exported; any field Sortable's root context provides that no part reads is removed; a disabled Sortable item is dimmed through `[data-disabled]`, replacing a `:disabled` selector that can never match a `div`
- [ ] Sortable and Resizable stay in the barrel and export parts only

**Verification:**

- [ ] `pnpm test:run packages/{layout,typography,buttons,interactive,markdown}` passes
- [ ] Barrel tests list the exact public names

**Dependencies:** Task 23

**Files likely touched:** the five package barrels, `packages/typography/src/reveal/`, `packages/markdown/src/markdown/`

**Estimated scope:** L, split typography-to-markdown into its own PR if large

### Task 25: Apply both rules to cards, lists, indicators and navigation (UI-437)

**Description:** Middle layer.

**Acceptance criteria:**

- [ ] Tabs, Pagination, Breadcrumbs and List export all their parts, matching Card, Menu and Accordion
- [ ] Slot types omit owned keys: Card and Avatar `ContainerProps`, Tabs `ListProps`, Accordion `TriggerProps` and `PanelProps`
- [ ] Each changed slot has a type test or, under the fallback, a precedence test

**Verification:**

- [ ] `pnpm test:run packages/{cards,lists,indicators,navigation}` passes
- [ ] Barrel tests list the exact public names

**Dependencies:** Task 24

**Files likely touched:** the four barrels and the `.types.ts` and main file of Card, Avatar, Tabs and Accordion

**Estimated scope:** L, one PR per package if needed

### Task 26: Give forms one `FieldSlotProps` type (UI-438)

**Description:** Replace the five shapes of `FieldProps` across the controls with one shared type that omits the keys a control owns.

**Acceptance criteria:**

- [ ] One exported `FieldSlotProps` type in `shared/`
- [ ] Input, Textarea, Select, Slider, NumberField and the group controls use it
- [ ] A type test shows `FieldProps={{ label }}` is rejected on each

**Verification:**

- [ ] `pnpm test:run packages/forms` passes

**Dependencies:** Task 25

**Files likely touched:** `packages/forms/src/shared/`, the `.types.ts` of each control (mechanical)

**Estimated scope:** L, mechanical

### Task 27: Apply the slot rule to the forms controls (UI-439)

**Description:** Select, Combobox, Autocomplete, NumberField, Checkbox, Radio and the groups.

**Acceptance criteria:**

- [ ] `TriggerProps`, `InputProps`, `ValueProps`, `PopupProps`, `GroupProps` and `CheckboxProps` omit owned keys, or the control is on the fallback list
- [ ] Combobox's `InputProps.after` can no longer drop the Clear and Trigger buttons
- [ ] Tests that asserted a slot prop winning are replaced by type or precedence tests

**Verification:**

- [ ] `pnpm test:run packages/forms` passes
- [ ] Docs build passes

**Dependencies:** Task 26

**Files likely touched:** the `.types.ts`, main file and test of each control

**Estimated scope:** L, one PR for the pickers and one for the rest

### Task 28: Apply the export rule to forms (UI-440)

**Description:** Trim the forms barrel from about 350 names to components, parts and their types.

**Acceptance criteria:**

- [ ] Constants, variant functions and internal hooks are no longer exported
- [ ] `useFormState` and `useFormSubmit` are either documented with an example or removed
- [ ] The barrel test lists the exact public names

**Verification:**

- [ ] Full build, Storybook and docs builds pass

**Dependencies:** Tasks 20b and 27

**Files likely touched:** `packages/forms/src/index.ts`, component index files, the barrel test

**Estimated scope:** M

### Task 29: Apply both rules to overlays and code (UI-441)

**Description:** Upper layer.

**Acceptance criteria:**

- [ ] `PopupProps` and `TriggerProps` on Dialog, Drawer, Popover and Tooltip, and `HeaderProps` on CodeBlock and CodeEditor, omit owned keys or are on the fallback list
- [ ] `onCopy` composes when given at both levels
- [ ] `DEFAULT_LANGUAGE` is used internally and no longer exported; CodeBlock's parts are exported as parts

**Verification:**

- [ ] `pnpm test:run packages/{overlays,code}` passes
- [ ] The CodeBlock README paragraph that documents the old precedence is rewritten

**Dependencies:** Task 25

**Files likely touched:** the `.types.ts` and main files of the six components, both barrels

**Estimated scope:** L, one PR per package

### Task 30: Apply both rules to tables and ai (UI-442)

**Description:** Top layer.

**Acceptance criteria:**

- [ ] Table's composition parts stay exported, with `useTableSelection` public because a composed selectable table needs it
- [ ] `@uiid/ai` exports its components, parts and types only

**Verification:**

- [ ] `pnpm test:run packages/{tables,ai}` passes
- [ ] Storybook build passes

**Dependencies:** Tasks 28 and 29

**Files likely touched:** both barrels and their barrel tests

**Estimated scope:** M

### Task 30b: Move Table's boolean style flags into `tableVariants` (UI-443)

**Description:** `striped`, `bordered` and `highlightOnHover` are styled through hand-written data attributes. Move them to cva, as the styling rules require for every variant axis.

**Acceptance criteria:**

- [ ] The three flags are axes of `tableVariants`
- [ ] The prop name and what it writes agree (`highlightOnHover` no longer becomes `data-hover`)
- [ ] Story pixel diffs show no visual change

**Verification:**

- [ ] `pnpm test:run packages/tables` passes
- [ ] The before-and-after story diff is attached to the PR

**Dependencies:** Task 30

**Files likely touched:** `packages/tables/src/table/table.variants.ts`, `table.module.css`, `subcomponents/table-root.tsx`

**Estimated scope:** M

## Phase 6: Deprecated APIs and `fullwidth`

### Task 31: Remove the remaining deprecated APIs (UI-444)

**Description:** Delete every `@deprecated` member except `fullwidth`, with its tests and README lines.

**Acceptance criteria:**

- [ ] Removed: Card's `FooterProps.hideSeparator`, Resizable's `direction` (and `data-direction` becomes `data-orientation`), Tabs' `TabsItemData.render` and the `TabProps` alias, and `useHighlighter`
- [ ] Their tests and README mentions are removed

**Verification:**

- [ ] `grep -rn "@deprecated" packages/*/src` shows only the `fullwidth` toggle
- [ ] `pnpm test:run packages/{cards,interactive,navigation,code}` passes

**Dependencies:** Phase 5 checkpoint

**Files likely touched:** the four components' types, main files, tests and READMEs

**Estimated scope:** L

### Task 32: Replace `fullwidth` with `w="full"` in the lower layers (UI-445)

**Description:** Codemod the toggle to `w="full"` in utils through navigation, including defaults inside components.

**Acceptance criteria:**

- [ ] No source file in layout, typography, buttons, interactive, cards, lists, indicators or navigation passes or defaults `fullwidth`
- [ ] Accordion and Tabs no longer take a public `fullwidth` prop
- [ ] Story pixel diffs before and after show no layout change, or each change is listed and accepted

**Verification:**

- [ ] `pnpm test:run` passes
- [ ] The before-and-after story diff is attached to the PR

**Dependencies:** Task 31

**Files likely touched:** many, mechanical

**Estimated scope:** L, mechanical

### Task 33: Replace `fullwidth` in the upper layers and delete the three mechanisms (UI-446)

**Description:** Finish the codemod in forms, overlays, code, tables, ai, stories and apps, then delete the toggle, Button's `fullwidth` variant and `.composes-fullwidth`.

**Acceptance criteria:**

- [ ] No file in `packages/` or `apps/` contains `fullwidth` outside build output
- [ ] The toggle, the Button variant and the composition are deleted, and `props.css` is regenerated
- [ ] Story pixel diffs show no unaccepted layout change

**Verification:**

- [ ] `grep -rnw fullwidth packages apps --exclude-dir={node_modules,dist,.next,storybook-static}` returns nothing
- [ ] Full build, `pnpm test:run`, Storybook and docs builds pass

**Dependencies:** Task 32

**Files likely touched:** many, mechanical; `packages/utils/src/props/styles/toggles.ts`, `packages/tokens/src/{props,compositions}.css`, `packages/buttons/src/button/button.variants.ts`

**Estimated scope:** L, mechanical

## Phase 7: Docs truth pass

### Task 34: Correct the component READMEs against their types (UI-447)

**Description:** Make every README describe only what exists.

**Acceptance criteria:**

- [ ] Tabs, Accordion, Collapsible, Tooltip, Reveal, Markdown, Drawer and the tokens README match their types, parts and tokens
- [ ] `@uiid/utils` has a README covering its public names
- [ ] No README is hard-wrapped

**Verification:**

- [ ] For each README, every prop and token it names is found by search in the component's types or CSS

**Dependencies:** Phase 6

**Files likely touched:** about ten README files

**Estimated scope:** L

### Task 35: Correct the Storybook overviews and rebuild the token tables on library components (UI-448)

**Description:** Fix overview pages that describe removed things, and replace the hand-built token tables.

**Acceptance criteria:**

- [ ] The cards and lists overviews, the Reveal story's sample text, `docs/architecture/ai/capability-map.md` and the `@uiid/ai` package description are accurate
- [ ] `TokenTable` and `TokenVisual` use `Table`, `Text` and `Stack` with no inline styles or hard-coded colours
- [ ] The docs header's inline `z-index` moves to a class

**Verification:**

- [ ] Storybook build passes and the token pages render in light and dark

**Dependencies:** Phase 6

**Files likely touched:** two overview MDX files, the token story subcomponents, one story, one doc, one manifest

**Estimated scope:** M

### Task 36: Add the missing READMEs and examples (UI-449)

**Description:** Give every component the docs material its siblings have, since this is what outside agents will read.

**Acceptance criteria:**

- [ ] Table has a README and `table.examples.tsx` covering both the data-driven and the composed form
- [ ] Timeline, Accordion, Menu and Tabs each have an `.examples.tsx`
- [ ] Sortable and Resizable stories render their examples

**Verification:**

- [ ] Each new examples file is rendered by a story (only forms has an examples meta-test today)
- [ ] Storybook build passes

**Dependencies:** Phase 6

**Files likely touched:** new README and example files, two stories

**Estimated scope:** L, one PR per package

### Task 37: Close out (UI-450)

**Description:** Confirm the success criteria and remove the working documents.

**Acceptance criteria:**

- [ ] Each of the seven success criteria in the spec is checked and the evidence is in the PR
- [ ] `docs/architecture/hardening-spec.md`, `tasks/plan.md` and `tasks/todo.md` are deleted
- [ ] The fallback list in `.agents/components.md` is final

**Verification:**

- [ ] Human review

**Dependencies:** All previous tasks

**Files likely touched:** the three working documents

**Estimated scope:** S
