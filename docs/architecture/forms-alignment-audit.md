# Forms Package Alignment Audit

**Date:** 2026-08-24
**Status:** Findings complete; improvement sequence proposed, tracking TBD

## Why

`@uiid/forms` (16 components) was propped up early and has fallen behind while the rest of
the library matured — layout, typography, tokens, cards, buttons, and overlays all went
through modernization passes (oklch shade system, derived spacing, examples-driven docs,
Base UI API mirroring, multi-story Storybook) that forms never received. This audit maps
the drift against current conventions and sequences the work to close it.

Four parallel audits were run against the conventions in `.agents/components.md`,
`.agents/styling.md`, the `packages/typography/src/text/` exemplar, and the recently
modernized packages (buttons, cards, overlays, tokens): **architecture/taxonomy**,
**styling/tokens**, **Base UI API alignment**, and **docs/stories/examples**.

## What is _not_ broken (verified — don't chase these)

- **Tests.** All 16 components have real coverage (6–42 tests each); forms is ahead of the
  exemplars here.
- **Base UI version.** 1.7.0 landed repo-wide (#305, #307); zero old-package-name imports.
  Every Base UI finding below is API _shape_, not version.
- **Manifest shape.** `exports` map, `sideEffects`, `tsconfig.json`, `vite.config.ts`
  match typography/buttons (three exceptions noted in findings).
- **Story dogfooding.** 16/17 story files already use `Stack`/`Group`/`Field` with no
  widespread hand-styled markup.
- `.mocks.ts` files, cross-package deps, vitest/Storybook registration, size-limit entry.

## Findings

### A. Correctness bugs (functional today, independent of any redesign)

1. ~~**Combobox/Autocomplete break a11y when a label is passed.**~~ **Withdrawn
   2026-08-30 — did not reproduce.** The original claim was that because
   `AutocompleteInput`/`ComboboxInput` pass `render={<Input label … />}` and `Input`
   wraps itself in `<Field>`, Base UI would merge its combobox props (`role`, `aria-*`,
   keyboard handlers, ref) onto the wrapper `Stack` div instead of the `<input>`.
   Probed directly against this code: a labelled `Combobox` puts `role="combobox"` on
   the `<input>`, `getByLabelText` resolves to that same input, and after `ArrowDown` it
   reports `aria-expanded="true"` with `aria-activedescendant` set and its options
   rendered. The finding missed that `render={<Input …/>}` passes a _component_, not a
   host element — Base UI hands the merged props to `Input`, which spreads its rest props
   onto the control, so the ARIA reached the input all along. Three unrelated defects were
   found while checking and fixed under UI-157: `ComboboxInput` never destructured the
   `FieldProps` it was passed (so it spread onto the DOM), `Field` silently discarded a
   `className` passed directly to it, and `AutocompleteInput` lacked the `fullwidth` and
   `FieldProps` its sibling had.
2. **`CheckboxField`/`SwitchField` render the control outside its own `Field.Root`** —
   the control renders as a _sibling before_ `FieldRoot`, so Base UI's validity wiring
   cannot reach it. Both hand-roll `Field.Item`, which Base UI 1.7 ships.
   (`checkbox/subcomponents/checkbox-field.tsx:44-73`; switch same.)
3. ~~**`CheckboxGroup` recasts `Checkbox.Root`'s `value` prop** (Base UI: value submitted
   when _unchecked_) as group identity and passes the same `name` to every child, so the
   group's `value` array cannot distinguish members.~~ **Withdrawn (UI-164) — does not
   reproduce on Base UI 1.7.** The quoted definition belongs to a _different_ prop:
   `uncheckedValue` is "the value submitted with the form when the checkbox is unchecked",
   while `value` is documented as "the checkbox's value. Identifies it within a Checkbox
   Group, falling back to `name` when omitted" (`CheckboxRoot.d.ts:95-109`). The runtime
   agrees — `CheckboxRoot.js:94-95,135` resolves `value = valueProp ?? name` and matches
   the group array with `groupValue.includes(value)`. Passing a unique per-item `value`,
   which is what the component already did, is the correct Base UI usage. Verified with a
   rendering test asserting `defaultValue={["b"]}` checks only the middle box.

   Group-level `disabled` was likewise **not** broken: `Field.Root`'s `disabled`
   propagates to the controls beneath it, so `<CheckboxGroup disabled />` already
   disabled every child.

   Three real defects _were_ found in the same code and are fixed under UI-164: per-item
   `disabled` from `items[]` was dropped on the floor (the shipped mocks include an item
   with `disabled: true` that did nothing), `{...CheckboxProps}` was spread after the
   per-item props so it could clobber `value`/`label`, and there was no way to compose
   children instead of passing `items`.

4. **`SliderValue` discards Base UI's `children(formattedValues, values)` contract**
   while claiming `Slider.Value.Props`; `slider.tsx:44` hardcodes a single thumb — range
   sliders cannot render. (`slider/subcomponents/slider-value.tsx:10-22`.)
5. **The package imports its own public entry.** `switch.types.ts:6` and
   `switch-label.tsx:3` import from `"@uiid/forms"` — a circular graph through the
   barrel; consumer builds resolve to the _published_ package.
6. **Seven dangling `styles["…"]` references** to classes that don't exist —
   `.select-placeholder` (`select.tsx:94`, `select-multiple.tsx:93`), `.switch-label`
   (`switch-field.tsx:38`), `.combobox-input` (`combobox-input.tsx:35`),
   `.autocomplete-empty`/`-input`/`-list`. Styling silently absent.
7. **Keyboard-invisible combobox actions.** `.combobox-action` uses `all: unset` and
   never restores `:focus-visible` — Clear/Toggle buttons have no focus indication.
   (`combobox.module.css:21-31`.)
8. **Dead/broken CSS:** `transition-duration-function` typo (easing never applies,
   `switch.module.css:20`); `--forms-bgActive` doesn't exist in tokens output
   (`number-field.module.css:65`); checkbox hit-area `::after` has no `content` so it
   never renders (`checkbox.module.css:41-44`).
9. **Select popup z-index (3, `--globals-z-index-modal`) renders behind dialogs**
   (overlays use 51); combobox/autocomplete positioners set no z-index at all.
10. **Invalid-state chaos — subsumes open issue #297.** Three incompatible invalid-state
    treatments (monochrome `--shade-foreground` on input/textarea; raw `--color-red-500`
    on checkbox/radio/field — the WCAG AA contrast failure; nothing at all on the other
    8 components).

### B. Base UI API mirroring (`.agents/components.md`: mirror, never rename/recast)

Target pattern: `packages/overlays/src/popover/` — 1:1 part wrappers, `BaseX.Part.Props`
types, additive-only extensions, subcomponents exported.

1. **`select/subcomponents` and `radio/subcomponents` are not exported from
   `src/index.ts`** — Select's compound API (9 wrapper files) is unreachable; both
   READMEs document the unimportable API.
2. **`SelectIndicator` renames `Select.Icon`** while `Select.ItemIndicator` is used
   separately — "Indicator" means two unrelated things. (Also sets
   `data-slot="select-icon"`, contradicting its own name.)
3. **`SelectMultiple` is an invented component** — a ~120-line near-verbatim copy of
   `select.tsx` that bypasses `SelectRoot`. Base UI models this as
   `Select.Root<Value, true>` via the `multiple` prop; `select.types.ts:9` already
   defines the type machinery.
4. **`Field` wraps only 4/7 parts — never `Field.Control`, `Field.Validity`, or
   `Field.Item`.** This is the root cause of A1/A2: without a `FieldControl` wrapper,
   nine components independently reimplement the same
   `ConditionalRender condition={label||description} render={<Field/>}` idiom.
   `Fieldset` is unused monorepo-wide.
5. **`Input` omits Base UI's `size` and re-adds it as a variant** — a documented recast.
   **Resolved (UI-169): kept, as the one sanctioned deviation from the mirror rule.**
   `size` is the system-wide control-scale axis (`small | medium | large`) and
   `inputVariants` is shared by select, slider, number-field, mask-input, combobox and
   autocomplete; native `size` on an `<input>` is the rarely-used character-width
   attribute. Surfacing it would desync Input from every other component for no
   practical gain. The rationale is recorded on `InputControlProps` itself.
6. **`RadioGroup` forces `defaultValue ?? items[0].value`** (cannot render unselected)
   and doesn't forward `required`/`disabled` to Field; `radio` imports `CheckboxField`
   from the checkbox directory with a `GroupProps` type recast.
7. **Partial part coverage:** autocomplete 8/21 parts, combobox 9/26 (invented
   `ComboboxActionButtons` fusing Clear+Trigger; hand-rolled input-wrapper div instead of
   `InputGroup`); number-field missing `Group`/`ScrubArea`; slider missing `Label`.
8. **`Textarea` has two divergent render paths** (with label → `Field.Control`; without →
   bare `<textarea>`), typed as raw `TextareaHTMLAttributes`. `Field.Control` should be
   unconditional. `mask-input` (legitimately hand-rolled — no Base UI primitive)
   likewise bypasses `Field.Control` and re-implements `data-invalid`/`data-required`.
9. Cleanest component: `form` — only issue is an unconditional inline
   `style={{display:"contents"}}`.

### C. Architecture & taxonomy

Score against the 8-file convention: **0/16 have `.examples.tsx`; 3/16 have
`.variants.ts`**; 16/16 READMEs are the wrong genre. (`.examples.tsx` now 16/16,
PR #354; `.variants.ts` now 6/16 — UI-172 below.)

1. **READMEs are usage manuals (106–206 lines, 2,324 total) where the convention is an
   11–53-line "use when" brief** — code belongs in `.examples.tsx`, prop tables are
   generated from types. Several are factually stale: number-field documents nonexistent
   `formatOptions` (real prop: `format`); select documents `<SelectIcon/>`; input omits
   shipped `before`/`after`/`FieldProps`. Forms is also the only package publishing
   source READMEs (`files: ["dist", "src/**/README.md"]`). **Resolved:** the genre
   rewrite landed in PR #357 (16/16 now 16–26 lines, stale facts corrected); the
   publishing anomaly is closed by UI-181 — `files` is now `["dist"]`, matching every
   other package. Nothing read the published copies: Storybook's `?raw` imports and
   `apps/docs`' `Readme` component both resolve READMEs from the repo source tree, not
   from `node_modules`.
2. **Variant vocabulary drift:** `ghost` is a boolean toggle (input/textarea, propagated
   by type-aliasing into select/select-multiple/slider/number-field) where the system
   uses a `variant: {subtle, ghost}` axis; sizes stop at small–large (no `xsmall`,
   though `--forms-size-xs-*` tokens and `composes-size-xsmall` exist); combobox,
   autocomplete, switch, radio, slider expose no `size` at all; checkbox defaults
   `small` while others default `medium`. **The `ghost` half is resolved (UI-170):** it
   is now `variant?: "ghost"` — a one-value axis matching Card's, not Button's two-value
   one, since `subtle` has no design or tokens for form controls and inventing one was
   out of scope. Covers input, textarea, select, slider and mask-input (cva, class
   `.variant-ghost`) plus toggle-group, and — beyond the forms package, since the drift
   was identical — navigation's tabs and accordion. The three data-attribute-styled
   controls (toggle-group, tabs, accordion items) key off `[data-variant="ghost"]`;
   accordion's descendant rule is scoped to `.accordion-root` because its root renders
   as a Card, which sets the same attribute. The size half is still open.
3. **Variants without `cva`:** `number-field.tsx:37` uses a template-literal class
   lookup; `SliderVariants = InputVariants` and `RadioVariants = CheckboxVariants` are
   wholesale type aliases (the sanctioned pattern is importing the _styles_, as
   `select-trigger.tsx` does with `inputVariants`). **Resolved (UI-172):** all three now
   declare their own `cva` — `number-field.variants.ts`, `slider.variants.ts`,
   `radio.variants.ts` — and derive `VariantProps` from it while still importing the
   shared styles. Slider's `size` was reaching the class list only through
   `inputVariants`' `defaultVariants`, so every slider silently rendered at the medium
   tier; the axis is now declared and exposed as a prop, which also closes part of C2 for
   slider.
4. **`input-wrapper.tsx`** sits stray at component root (not `subcomponents/`), is
   imported cross-component by mask-input, and is never exported — the before/after slot
   pattern is uncomposable by consumers. **Resolved (UI-169):** `input-wrapper.tsx` and
   `input-control.tsx` both moved to `input/subcomponents/` and are exported through the
   package barrel; `InputWrapperProps` moved to `input.types.ts`.
5. **Barrel drift:** exports checkbox/select constants (no mature barrel exports
   constants) while omitting the two subcomponent dirs (B1).
6. **Manifest drift:** unused `@number-flow/react` dependency (zero usage);
   `@uiid/icons` and `@uiid/layout` duplicated in `dependencies` + `devDependencies`.
7. **Taxonomy overlap:** select-multiple duplicates select (B3); combobox/autocomplete
   are structurally identical trees that should share their popup/list/item/empty layer;
   radio/switch reuse or copy `CheckboxField` — the shape wanted is one shared field-row
   component in `field/subcomponents/`. `switch-label.tsx` is dead code.
8. **Cleanup-pass list:** missing `"use client"` (field, radio, input-wrapper); non-JSX
   `.tsx` utils and mutable module-level `Map` caches in mask-input; unprefixed/untyped
   constants; hardcoded `aria-label="checkbox"` overriding real labels
   (`checkbox-root.tsx`); `form/` missing `.types.ts`.

### D. Styling & tokens

Systemic root causes, then the notable instances:

1. **No component token files for most of forms** — `packages/tokens/src/json/component/`
   covers only checkbox and switch. Slider, radio, textarea, select, combobox,
   autocomplete, number-field, and field hardcode every dimension.
2. **`composes-*` compositions under-adopted:** textarea restates size tiers instead of
   `composes-size-*`; checkbox/input hand-roll the disabled treatment; combobox bypasses
   `composes-field-slot` with an absolute-positioned overlay.
3. **Input→Select style-sharing is done via className concatenation plus an exclusion
   selector** (`input.module.css:7`) instead of a shared composition — which is why
   `.toggle-ghost`/`.toggle-fullwidth` got copy-pasted byte-for-byte into textarea.
4. **Zero `calc(var(--spacing-unit) * n)` in the entire package** — all spacing is raw
   rem literals (20+ sites), against the derived-spacing rule.
5. **Focus inconsistency:** input/textarea use `:focus` (ring on mouse click) vs
   `:focus-visible` everywhere else; number-field uses `:focus-within`; switch uses a
   `::before` pseudo-element; slider omits `outline-offset`.
6. **Raw palette steps** (`--color-red-500`) in checkbox/radio/field — components must
   never name a hue or step (use `--palette-*` under `.palette-<hue>`).
7. **Seven inline-style violations** in `.tsx` (form, select-list, number-field,
   combobox, field-error-tooltip ×2, plus an icon `color=` prop pipe).
8. **NumberField's +/− buttons re-implement Button's surface** (border/bg/radius/hover/
   transition/sizing, ~30 lines) instead of composing shared styles.
9. Assorted: non-square select chevron (height/width from different sources); PascalCase
   `.ScrubArea` classes; radio checked-state hover lightening (checkbox scopes hover to
   `[data-unchecked]`); low-contrast radio indicator; physical `margin-left` amid logical
   properties; `--globals-padding-y` used as a tooltip offset.

### E. Docs, stories, examples

Modern pipeline: `{c}.examples.tsx` → thin stories (isolated `Playground` + one story per
example) → `{c}.mdx` (README + `<Controls>`) → `overview.mdx` → docs page + sitemap entry.
**Forms scores 1/6 on every component.** Coverage: examples 0/16 · docs-app 0/16 ·
multi-story 3/16 · README 16/16 but stale-format.

1. **Zero `.examples.tsx`** — the keystone; `apps/docs` reads them by convention, so no
   forms docs page can exist until these land. Forms is fully absent from
   `apps/docs/sitemap.ts` and `apps/docs/app/(components)/`.
2. **No `.mdx` in `stories/forms/`** — no `overview.mdx`, no per-component MDX: the
   2,324 lines of README render nowhere, and there is no `<Controls>` block.
3. **Story structural defect:** 15/17 files put the whole variant sheet in `meta.render`
   with every instance spreading `{...args}` — one Controls toggle mutates every
   instance; no isolated `Playground`. Inverse of the button/text pattern.
4. **`form` has no story file at all** — the only component with zero direct coverage.
5. **State coverage gaps:** invalid/error absent from 14/16 component stories;
   `errorType` (inline/tooltip/absolute) undemonstrated; controlled-vs-uncontrolled
   unstoried; checkbox/radio never exercise `size`.
6. **Composition stories** (`username-password`, `select-and-confirm`) create a phantom
   `Forms/Form` sidebar folder, contain the package's only hand-styled markup, and
   duplicate ~95% of their submit-handling blocks — they belong as `form.examples.tsx`
   exports.
7. **`tags: ["beta"]/["new"]` linger on 14 story files** — the overlays sweep (8fa58ef5)
   never reached forms.

## Root causes

Most findings collapse into four:

1. **`Field.Control`/`Field.Item` were never wrapped**, so nine components improvised the
   same conditional-Field idiom — producing the Field-scoping bug (A2) and the
   textarea/mask-input split-brains. (A1 was also attributed here; it has since been
   withdrawn — see the correction under Findings A.)
2. **No `.examples.tsx` pipeline**, so forms is invisible to the docs site, stories drift
   independently, and visual drift went unnoticed.
3. **No component token files + under-adopted compositions**, so styling was hand-rolled
   per component and diverged (focus, invalid, sizing, spacing).
4. **Pre-maturation vocabulary was never migrated** (ghost boolean, missing xsmall/size,
   README genre, beta tags) when the system's conventions moved.

## Improvement sequence

Ordered by dependency: fix the foundations before writing the docs that describe them.
Phases 1–3 change public API shape (pre-1.0: breaking bumps minor via release-please).

**Phase 0 — Correctness sweep (no API changes; can start immediately, small PRs).**
Self-imports → relative; dangling style references (add or remove the 7 classes); dead
code (`switch-label.tsx`, dead switch background declarations, commented CSS);
`transition-duration-function` typo; `--forms-bgActive`; checkbox `::after` content;
focus-visible unification + combobox action focus restoration; popup z-index alignment
with overlays; inline-style violations; unused/duplicated deps; `aria-label="checkbox"`;
`"use client"` gaps; beta/new tag sweep.

**Phase 1 — Field architecture (the core fix).**
Wrap `Field.Control`, `Field.Validity`, `Field.Item`; replace the nine conditional-Field
reimplementations with one unconditional `Field` path; correct prop routing in the
Combobox/Autocomplete inputs (A1 as filed was withdrawn); rebuild
`CheckboxField`/`SwitchField`/radio row on `Field.Item` with correct scoping (A2); make
Textarea/MaskInput use `Field.Control` unconditionally; **one invalid-state language** on
`--palette-*` tokens across all 16 (closes #297).

**Phase 2 — API surface alignment.**
Export select/radio subcomponents; `SelectIndicator` → `SelectIcon`; collapse
`SelectMultiple` into `Select multiple`; fix CheckboxGroup value/name semantics;
RadioGroup unselected default; Slider range + value render-prop contract; fill part
coverage (combobox `InputGroup`/`Chips`, autocomplete parts, number-field
`Group`/`ScrubArea`, slider `Label`); share the combobox/autocomplete
popup/list/item/empty layer; move `input-wrapper` into exported subcomponents; decide the
`Input size` recast (likely keep, documented as the one sanctioned deviation, or rename).

**Phase 3 — Variants, tokens, styling system.**
`ghost` boolean → `variant` axis; add `xsmall` + size to sizeless controls; align size
defaults; real `cva` variants for number-field/slider/radio; component token files for
the eight uncovered components; migrate raw rems to derived spacing; shared
field-surface/fullwidth compositions (kill the input↔textarea copy-paste and the
input↔select exclusion selector); NumberField buttons compose shared control surface.

**Phase 4 — Docs surface (written against the settled API).**
`{c}.examples.tsx` × 16 (compositions fold into form examples); story rewrite to
Playground + per-example stories; per-component MDX + `overview.mdx`; README rewrite to
the short "use when" genre (drop hand prop tables, fix stale facts); docs-app pages +
sitemap category; drop `src/**/README.md` from published files.

**Phase 5 — Palette color prop (feature, not remediation).**
Bring the Button/Card `color` prop (`PaletteColor` + `paletteColorStyles` from
@uiid/tokens) to form controls. Sequenced after the shared field-surface composition so
one wiring covers all 16 controls, and built on the same plumbing as the invalid-state
unification (invalid is palette-red through the same `--palette-*` vars). Input/Textarea
reference implementation first, then selection controls (checked surfaces), then the
composed controls + examples coverage.

## Tracking

Tracked in Linear: [Forms Package Alignment](https://linear.app/uiid/project/forms-package-alignment-ce98502a53f0)
— 38 issues (UI-147 through UI-184), one milestone per phase (Phase 5 adds the palette
color prop as a feature). Phase 0 items are
independent small PRs and can be picked up in any order; the combobox a11y fix (UI-157)
is marked urgent.
