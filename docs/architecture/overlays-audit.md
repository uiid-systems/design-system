# Overlays — Platform Parity & Architecture Audit

> Pre-work audit ahead of giving `@uiid/overlays` the same treatment as layout,
> typography, cards, and lists. Records parity gaps, verified defects, and
> architectural opportunities so the platform work (docs, stories, examples) can
> proceed without silently baking in the current shape.

**Status: complete.** Overlays meets the treatment contract — authored READMEs,
`*.examples.tsx`, Storybook MDX + overview, and docs routes for all five. §7 was
actioned first (`Modal` → `Dialog`, `Sheet` → a Base UI `Drawer`); see 7.8.
**D1–D4 and D6–D8 are resolved.** Only **D5** (TooltipPopup's inline colors)
remains.

Sections 1–6 describe the state _as found_ and cite pre-rename paths; they are
kept as the record of why.
**Revisit:** A1–A5 and 7.10, now that the docs/stories/examples layer is in place.

---

## 1. What "treated" means

The treated packages converge on one contract. A component is fully treated when
all five exist:

| Artifact        | Path                                                                 | Consumed by                                    |
| --------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| Authored README | `packages/{pkg}/src/{c}/README.md`                                   | docs `<Readme of>`, Storybook `<Markdown>`     |
| Examples module | `packages/{pkg}/src/{c}/{c}.examples.tsx`                            | docs `<Example of name>`, Storybook stories    |
| Docgen surface  | `packages/{pkg}/src/{c}/{c}.tsx`                                     | docs `<PropsTable of>`, Storybook `<Controls>` |
| Storybook MDX   | `apps/storybook/stories/{pkg}/{c}.mdx` + `.stories.tsx`              | Storybook                                      |
| Docs route      | `apps/docs/app/(components)/{pkg}/{c}/page.mdx` + `sitemap.ts` entry | docs site                                      |

The key property: **examples are written once in the package and rendered by both
surfaces.** `apps/docs` and `apps/storybook` are both thin consumers. Docs pages
resolve everything by path convention from the `of="pkg/component"` string
(`apps/docs/components/docs/{readme,example,props-table}.tsx`).

## 2. Parity matrix

|                  |           README           |   examples    |      stories       |   story MDX   | overview MDX  |  docs route   | tests |
| ---------------- | :------------------------: | :-----------: | :----------------: | :-----------: | :-----------: | :-----------: | :---: |
| layout (7)       |          authored          |      ✅       |         ✅         |      ✅       |      ✅       |      ✅       |  ✅   |
| typography (4)   |          authored          |      ✅       |         ✅         |      ✅       |      ✅       |      ✅       |  ✅   |
| cards (1)        |          authored          |      ✅       |         ✅         |      ✅       |      ✅       |      ✅       |  ❌   |
| lists (1)        |          authored          |      ✅       |         ✅         |      ✅       |      ✅       |      ✅       |  ❌   |
| **overlays (5)** | ~~generated~~ **authored** | ~~❌~~ **✅** | ~~minimal~~ **✅** | ~~❌~~ **✅** | ~~❌~~ **✅** | ~~❌~~ **✅** |  ✅   |

Struck-through cells are the state as found; overlays now meets the contract in
full. What follows describes the original state and why each gap mattered.

Overlays was **Modal, Popover, Sheet, Tooltip, Toaster** — now **Dialog, Drawer,
Popover, Tooltip, Toaster.**

**Sheet becomes `Drawer`.** Sheet is Base UI–backed today
(`@base-ui/react/dialog` via `sheet/subcomponents/sheet-root.tsx`) with 355 lines
of tests, but it is only a Dialog styled to slide from an edge. Base UI 1.2.0 now
ships a real `drawer` primitive, so Sheet is being rebuilt on it **under the Base
UI name** — see §7.

The component removed on this branch (PR #277) was a _different_ Drawer, built on
`vaul` and carrying an explicit `@deprecated Vaul is currently abandoned. Also
uses Radix instead of Base UI.` No `vaul` references remain. The incoming
`Drawer` shares nothing with it but the word.

Worth stating plainly: **overlays is the best-tested package in this group**
(1,519 lines across five suites) while cards and lists have no tests at all. The
gap is presentation, not correctness. Treatment should not regress the tests.

### 2.1 Storybook gap detail

Treated packages ship `{c}.mdx` (Meta + Markdown readme + Controls) and a package
`overview.mdx`. Overlays ships **neither** — only bare `.stories.tsx`, each a
single `Default` story (23–45 lines). That conflicts with the established
multi-story convention (break out by variant dimension).

The overlay stories also use raw `<button>` / `<span>` as triggers rather than
`Button`, which contradicts the dogfooding rule. Since triggers are the most
copy-pasted part of an overlay example, these are the worst places to model
non-system markup.

## 3. Verified defects

Each confirmed by reading source or executing the pipeline — not inferred.

### D1 — Docgen silently drops the most important overlay props ⚠️ blocker

`PropsTable`'s `propFilter` excludes any prop whose declaration lives in
`node_modules` (`apps/docs/components/docs/props-table.tsx:9-11`). Overlay control
props are inherited from Base UI (`Pick<ModalRootProps, "open" | "onOpenChange">`,
where `ModalRootProps = BaseDialog.Root.Props`), so they are filtered out.

Executed against the real parser:

```
overlays/modal   → trigger, RootProps, TriggerProps, PortalProps, BackdropProps,
                   PopupProps, size, title, icon, description, action, footer
overlays/tooltip → trigger, ProviderProps, RootProps, TriggerProps, PortalProps,
                   PositionerProps, PopupProps
overlays/popover → trigger, RootProps, TriggerProps, PortalProps, BackdropProps,
                   PositionerProps, PopupProps, title, icon, description, action, footer
```

`open`, `onOpenChange`, and Tooltip's `delay` are **absent from all three**. Cards
and layout are unaffected because their props are declared locally. A docs page
built today would document overlays as having no way to control them.

**Resolved.** `propFilter` now lets `@base-ui/react` declarations through — it is
the one dependency whose props are part of our public API. React's HTML
attributes still come from `@types/react` and stay filtered, so Card is unchanged
at 57 props. Re-running the parser after the fix:

```
overlays/dialog  → …, onOpenChange, open, size            (14 props)
overlays/drawer  → …, defaultOpen, modal, onOpenChange, open,
                   onSnapPointChange, snapPoint, snapPoints,
                   swipeDirection, defaultSnapPoint        (22 props)
overlays/tooltip → …, delay, onOpenChange, open           (10 props)
overlays/popover → …, onOpenChange, open                  (14 props)
```

### D2 — `var(--modal-width)` is undefined

`packages/overlays/src/modal/modal.module.css:37` sets
`max-width: var(--modal-width)`. That variable is defined nowhere in the repo —
`modal.tokens.json` only emits `--modal-size-{sm,md,lg,xl}`. The declaration is
invalid at computed-value time and is masked only because `modalVariants` always
applies a size class (default `medium`) that sets `max-width` again. Dead code
that reads as intentional.

### D3 — No overlay actually consumes its own layering token

`overlays.tokens.json` defines `overlays.backdrop.z-index: 50`, emitted as
`--overlays-backdrop-z-index`. Three separate failures stack up:

- **Modal hardcodes it.** `z-index: 2` (backdrop) and `z-index: 3` (popup) —
  `modal.module.css:21,42`.
- **Sheet misspells it.** `sheet.module.css:9,22` reference
  `var(--overlays-backdrop-zIndex)` in **camelCase**; the generated custom
  property is kebab-case. Both declarations are invalid at computed-value time,
  so Sheet's backdrop and popup get no `z-index` at all.
- **The only real consumer is unrelated.**
  `packages/code/src/code-block/code-block.module.css:101`.

Sheet also assigns the _same_ z-index to backdrop and popup, so even once the
name is fixed the popup isn't guaranteed to paint above its own backdrop. There
is no layering scale anywhere — this wants one token set (backdrop / popup /
toast) rather than a single backdrop value.

### D4 — `children` is passed twice in Modal and Popover popups

`ModalPopup` and `PopoverPopup` both pass `children` into the `render={<Card>}`
element _and_ as JSX children of the Base UI popup
(`modal/subcomponents/modal.popup.tsx:22-37`,
`popover/subcomponents/popover-popup.tsx:17-35`). Base UI's merge order makes one
of them dead. Ambiguous at best; should be reduced to a single path.

### D5 — TooltipPopup hardcodes colors inline

`tooltip/subcomponents/tooltip-popup.tsx:22-27` sets `backgroundColor` and `color`
via an inline `style` object rather than its CSS module. It is the only overlay
that inverts its surface and the only one doing it ad hoc — this belongs in
`tooltip.module.css` (and arguably wants tooltip tokens, which don't exist).

### D6 — Overlays READMEs are registry-generated, not authored

Every overlays README follows the old generated template: `Quick Reference /
Examples / Props / Anatomy / Data Slots / Accessibility / See Also`, with a
`## Props` table whose types are largely `any` and whose descriptions are all `—`.
Card's README is authored prose with no Props table, because docs and Storybook
render props from docgen.

Consequence: an overlays docs page rendering `<Readme>` _and_ `<PropsTable>`
shows props **twice** — once stale and `any`-typed, once real.

**Resolved.** All five READMEs are rewritten in the treated voice — a blockquote,
a "Use X when you want to" list, and only the genuinely non-obvious extras
(Drawer's `Parts`/`Caveats`, Toast's `Three pieces`). The `Quick Reference`,
`Examples`, `Anatomy`, `Data Slots`, and `Accessibility` sections are gone: props
come from docgen and examples from the live `<Example>` blocks, so keeping them
in the README was a second, drifting copy. Verified on the rendered pages — each
now has exactly one `Props` and one `Examples` heading.

### D7 — The README generator is now adversarial to authored READMEs

`scripts/generate-readmes.mjs` iterates the registry and, for each entry:

- `replacePropsSection` (line ~113) — if a README has **no** `## Props` section it
  **appends** a generated one before `## See Also` or at EOF;
- `updateTitleAndDescription` (line ~139) — overwrites the `# Title` and the `>`
  description blockquote from the registry entry.

Card, Box, Group, Layer, Separator, Stack, and Text are all registry entries with
authored READMEs. Running `pnpm generate-readmes` today would inject stale
`any`-typed props tables into them and overwrite their authored descriptions.
This is a live regression risk for already-treated packages, not just overlays.

**Resolved.** The generator now only ever **scaffolds a README that does not
exist** — it never rewrites one. `replacePropsSection`,
`updateTitleAndDescription`, and the props-table builders are deleted (the script
went from ~200 lines to 96), and the scaffold no longer embeds a props table,
since docgen renders props from the real source.

Verified by running `pnpm generate-readmes`: **zero tracked READMEs modified**,
27 reported as `KEEP`. (It offered to scaffold 8 READMEs for components that have
none — Alert, Avatar, Badge, Kbd, Progress, Status, Collapsible, Breadcrumbs.
Those stubs were discarded as out of scope; the gap is real but belongs to
whoever treats those packages.)

### D8 — Sheet hand-rolls layout that the system already owns

`.sheet-footer` (`sheet.module.css:33-39`) declares `display: flex`,
`flex-direction: column`, `gap: 0.5rem`, `padding: 1rem` directly, and
`.sheet-popup` hardcodes `--inset: 1rem`. That contradicts the styling hierarchy
(components > tokens > shared styles > ad hoc) — the spacing values should come
off the spacing scale rather than being literal rems.

Worse, **`.sheet-footer` is dead code**: nothing references it. The footer is
actually positioned by an inline `FooterProps={{ style: { marginTop: "auto" } }}`
in `sheet-popup.tsx:31`. So the styling exists in two places and the CSS one is
inert.

`.sheet-popup` also redeclares `background-color: var(--shade-surface)` and
`color: var(--shade-foreground)`, which `Card` already provides — Sheet _does_
render through `Card` (`sheet-popup.tsx:25-33`), so these are redundant.

Separately, `SheetPopup` is the only sheet part with **no `data-slot`** — root,
trigger, portal, backdrop, and close all set one. The README documents only
`sheet-backdrop`.

_(Cross-links are fine: `modal/README.md` → `../sheet/README.md` resolves, and the
registry's `sheet` entry is still valid. The `drawer` registry entry and token
file were removed cleanly with the component.)_

### D9 — Referenced docs that don't exist

`CLAUDE.md` points at `apps/docs/DOCS_GUIDE.md` for docs-app work; the file is not
in the repo. (`docs/VISION.md`, referenced elsewhere, is likewise absent.) Anyone
following the guide table hits a dead end.

## 4. Architecture — skeptical read

### A1 — The `XProps` prop-bag pattern is the central question

All four overlays expose a closed, flat component whose only escape hatch is a bag
of pass-through props: `RootProps`, `TriggerProps`, `PortalProps`, `BackdropProps`,
`PositionerProps`, `PopupProps`.

Arguments for the current shape: one import, no context wiring, trivially
serializable for the registry/blocks tree format, and a consistent
`title/description/icon/action/footer` content API shared with Card.

Arguments against:

- **Structure is fixed.** You cannot omit the backdrop, reorder parts, put two
  triggers on one popup, or render anything between positioner and popup.
- **It documents badly.** A props table of six opaque `*Props` bags typed as
  `ModalRootProps` teaches nothing, and D1 means the props that _do_ matter are
  missing. Base UI's own docs are per-part for this reason.
- **It's unlike its own subcomponents.** The parts already exist and are already
  composable — they're just not all exported (see A2).
- **It diverges from Base UI's idiom**, so upstream docs and examples don't
  transfer to our users.

Note that Card uses the same slot-props idiom, so this is a house pattern, not an
accident. The honest framing: the pattern suits _content_ components (Card) better
than _structural_ ones (overlays), because overlay composition varies more.

Not proposing a rewrite. Proposing that we decide, before writing examples,
whether examples teach the flat API only, or the flat API plus a composable
escape hatch — because the examples are what freeze the public story.

### A2 — Subcomponent exports are inconsistent

`packages/overlays/src/index.ts` exports `tooltip/subcomponents` but **not**
modal's, popover's, or toast's. So Tooltip is quietly composable from the package
root and the others are not. Either all parts are public or none are; today it
reads as an oversight rather than a decision.

### A3 — `toast` vs `Toaster` naming breaks the path convention

The directory is `toast/`, the component is `Toaster`, the registry entry is
`toaster`. The README generator carries an explicit
`DIR_OVERRIDES = { Toaster: "toast" }` hack, and `PropsTable`'s
`displayName === target` lookup misses and only works via its `?? docs[0]`
fallback (verified: it resolves, but by accident). It also forces a choice for the
docs route: `/overlays/toast` or `/overlays/toaster`.

Toast is also structurally unlike its siblings — a provider + viewport + hook, not
a trigger + popup. It needs a different docs template regardless.

### A4 — Token coverage is uneven

`modal.tokens.json` and `popover.tokens.json` exist; there are no tooltip or toast
tokens, and `overlays.tokens.json` holds only backdrop opacity and an unused
z-index. Shared overlay concerns (elevation, layering scale, popup padding, motion
duration) are split between `compositions.css` and per-component modules with no
stated rule for which wins.

### A5 — Modal opts out of the shared popup composition

`composes-popup` in `packages/tokens/src/compositions.css:89` is the shared
floating-surface behaviour (transform-origin, enter/exit transitions,
`[data-instant]` handling). Used by `popover`, `tooltip`, `forms/select`,
`forms/combobox`, `forms/autocomplete`. **Modal hand-rolls its own transition**
instead. Possibly justified (it's centered, not anchored) but currently
undocumented and a source of motion drift.

### A6 — Base UI now ships a purpose-built Drawer/Sheet primitive we don't use

Base UI **1.2.0** (the version we're on) added a `drawer` primitive — changelog:
_"Create new Drawer / Sheet component (#3680)"_. Its parts go well beyond Dialog:

```
root · provider · trigger · portal · backdrop · popup · content
viewport · swipe-area · indent · indent-background · title · description · close
```

`swipe-area` and `indent` are the drag-to-dismiss and background-scale behaviours
that `vaul` existed to provide. Our `Sheet` predates this and is built on
`@base-ui/react/dialog`, so it slides via CSS transforms with **no gesture
support** — on touch it can only be dismissed by backdrop tap or Escape.

So the vaul Drawer removal did not lose a capability permanently; Base UI
absorbed it. The open question is whether `Sheet` should be re-based onto
`Drawer`, which would give it swipe-to-close for free and let us delete the
hand-rolled `side-*` transform CSS (D8).

**The catch:** it is exported as `DrawerPreview`
(`drawer/index.d.ts:1`) — an explicitly unstable namespace. Adopting it means
taking a preview API into the design system's public surface, and its parts
(`viewport`, `indent`) imply a mount-point contract on the app shell that our
other overlays don't have.

**Decision: adopt, under the Base UI name.** `Sheet` is replaced by `Drawer` built
on `@base-ui/react/drawer`. Two facts de-risk the preview status materially:

- `packages/overlays/package.json:47` pins `"@base-ui/react": "1.2.0"` **exactly**
  (no caret), so the preview API cannot shift under us on an install.
- `DrawerPopup` reuses the dialog store and still emits `role`,
  `aria-labelledby`, and `aria-describedby` (`drawer/popup/DrawerPopup.js:256-258`),
  so Sheet's 355 lines of dialog-semantics tests remain meaningful.

See §7 for the integration design.

## 5. Taxonomy

The package boundary does not match the behavioural boundary.

Floating, portalled surfaces in the repo today:

| Component    | Package     | Uses `composes-popup`        |
| ------------ | ----------- | ---------------------------- |
| Modal        | overlays    | ❌ (A5)                      |
| Popover      | overlays    | ✅                           |
| Sheet        | overlays    | ❌ (own `side-*` transforms) |
| Tooltip      | overlays    | ✅                           |
| Toaster      | overlays    | ❌ (viewport, not popup)     |
| Select       | forms       | ✅                           |
| Combobox     | forms       | ✅                           |
| Autocomplete | forms       | ✅                           |
| Menu         | interactive | ?                            |

Three of the five `composes-popup` consumers live outside `overlays`. That's
defensible — `forms/select` is a form control first — but it means **"overlay" is
currently a packaging category, not a behavioural one**, and the shared behaviour
lives in `tokens/compositions.css` rather than in `overlays`.

Questions to settle (not now, but before the taxonomy is documented publicly):

- Is `overlays` "things that portal above the page" or "standalone dialog-ish
  surfaces"? Tooltip fits the first; Toaster fits neither cleanly.
- Should the shared floating-surface behaviour be owned by `overlays` and consumed
  by `forms`, rather than both reaching into `tokens`?
- Does the docs sidebar need an _Overlays_ category that cross-references the
  form popups, so users comparing "Popover vs Select" find both?

Also: `apps/storybook/stories/tokens/overlays.stories.tsx` and
`tokens/popover.stories.tsx` put overlay token tables under **Tokens**, while
component stories live under **Overlays**. Fine, but the overlays overview should
link across.

## 6. Recommended sequencing

Platform work first, architecture second — but D1 gates the docs routes.

1. **Unblock docgen (D1).** Without this, overlay props tables are wrong. Decide:
   relax `propFilter`, or declare control props locally.
2. **Neutralise the generator (D7).** Stop `generate-readmes` from owning README
   bodies before hand-authoring overlay READMEs, or the next run reverts them.
   This also protects cards/layout/typography.
3. **Land the `Drawer` rewrite (§7).** Sheet → Base UI `Drawer`. This must precede
   the docs work, or Sheet gets documented and then deleted.
4. **Author READMEs (D6).** Rewrite all five overlay READMEs in the Card voice —
   "Use X when you want to…" — and drop the stale Props tables.
5. **Write `*.examples.tsx`** for modal, popover, drawer, tooltip, toast. This is
   the highest-value step: it feeds docs and Storybook simultaneously.
6. **Storybook parity.** Per-component `.mdx`, an `overview.mdx`, multi-story
   breakdown, and replace raw `<button>` triggers with `Button`.
7. **Docs routes.** Add the `Overlays` category to `COMPONENTS_SITEMAP` and five
   `page.mdx` shells. Settle `toast` vs `toaster` in the URL (A3).
8. **Then revisit** D2–D5, D8 (small, safe fixes) and A1–A5, 7.9 (real decisions).

Items 1–2 are prerequisites. Item 3 is a component rewrite. Items 4–7 are the
treatment. Item 8 is the revisit the audit was written for.

---

## 7. Integration design — adopt Base UI `Drawer`

**Governing principle: mirror the Base UI API.** The library already does this
consistently — `SelectRootProps = BaseSelect.Root.Props`,
`CollapsibleRootProps = Collapsible.Root.Props`. Prop bags forward Base UI props
verbatim; our additions are additive extras (`before`, `after`, `items`,
`instant`), never renames. Component names match the primitive: Popover, Tooltip,
Select, Accordion, Collapsible, Menu, Tabs.

Renaming a primitive or recasting a prop it already ships is an unnecessary
abstraction layer — it costs us upstream docs transfer, makes every Base UI
example fail to copy-paste, and buys nothing. The library is not widely enough
used to justify preserving a worse API for compatibility's sake.

### 7.1 The component is named `Drawer`

`Sheet` is replaced by `Drawer`, built on `@base-ui/react/drawer`. Not renamed,
not aliased, no deprecation shim — a clean break.

- Directory: `packages/overlays/src/drawer/`
- Registry entry: `drawer` — re-added, this time as the Base UI component
- Docs route: `/overlays/drawer`

`Sheet` was only ever a Dialog styled to slide from an edge; Base UI now ships the
real thing under its own name. Keeping our name for it would be exactly the
abstraction we're trying to avoid.

> **Sequencing note.** PR #277 removed the old vaul `Drawer` along with its
> registry entry and `drawer.tokens.json`. That PR should merge first, so the
> Base UI `Drawer` lands as a clean addition rather than a confusing diff against
> the vaul one.

### 7.2 Props are Base UI's props

No `side`. No invented `swipeable`. `Drawer.Root` already expresses all of it:

| Prop                                                                                         | Source                                                                                                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `swipeDirection`                                                                             | `'up' \| 'down' \| 'left' \| 'right'`, default `'down'` — determines the anchored edge _and_ dismissal direction |
| `snapPoints`, `snapPoint`, `defaultSnapPoint`, `onSnapPointChange`, `snapToSequentialPoints` | snap positioning                                                                                                 |
| `modal`                                                                                      | `boolean \| 'trap-focus'`                                                                                        |
| `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`                                | open state                                                                                                       |
| `disablePointerDismissal`, `actionsRef`, `handle`, `triggerId`                               | behaviour + detached triggers                                                                                    |

Part types alias Base UI verbatim, matching Select and Collapsible:

```ts
export type DrawerRootProps = BaseDrawer.Root.Props;
export type DrawerTriggerProps = BaseDrawer.Trigger.Props;
export type DrawerPortalProps = BaseDrawer.Portal.Props;
export type DrawerBackdropProps = BaseDrawer.Backdrop.Props;
export type DrawerViewportProps = BaseDrawer.Viewport.Props;
export type DrawerContentProps = BaseDrawer.Content.Props;
export type DrawerPopupProps = BaseDrawer.Popup.Props & DrawerCardProps;
```

The only additions are the Card content slots we already share across overlays
(`title`, `description`, `icon`, `action`, `footer`) and the house prop bags.

```tsx
import { DrawerPreview as BaseDrawer } from "@base-ui/react/drawer";
```

### 7.3 `sheet.variants.ts` disappears

This is the payoff of not recasting the API. Our `side` prop existed to drive a
cva that mapped `side` → `.side-right` / `.side-left` / …

Base UI already emits **`data-swipe-direction`** on the popup, and its own docs
style against it. So the cva and the variants file are deleted outright and the
CSS keys off the attribute:

```css
.drawer-popup[data-swipe-direction="right"] {
  /* … */
}
```

One less abstraction, one less file, and styling stays in lockstep with whatever
the primitive reports.

### 7.4 Anatomy — Card remains the renderer

```
DrawerProvider          → Drawer.Provider          (opt-in, app shell)
  DrawerIndentBackground→ Drawer.IndentBackground  (opt-in)
  DrawerIndent          → Drawer.Indent            (opt-in, wraps app UI)
    DrawerRoot          → Drawer.Root
      DrawerTrigger     → Drawer.Trigger
      DrawerPortal      → Drawer.Portal
        DrawerBackdrop  → Drawer.Backdrop
        DrawerViewport  → Drawer.Viewport          ← new layer
          DrawerPopup   → Drawer.Popup   render={<Card …/>}
            DrawerContent → Drawer.Content         ← new layer
```

`Card` stays the popup renderer via `render`, exactly as Modal and Popover do —
that is our house content API and it is additive to Base UI rather than a
replacement for it.

`Viewport` is the positioning container; `Content` is what lets a mouse user
select text without starting a drag. **`DrawerSwipeArea` could not be adopted.** The part exists on disk
(`drawer/swipe-area/`) and is listed in the upstream API reference, but
`@base-ui/react@1.2.0` exports it from **neither** `index.parts` nor the type
surface — the compiler caught it. It is omitted rather than reached for through
internals. This is the preview-API instability of A6 showing up concretely on day
one, and a good argument for the exact version pin.

### 7.5 The CSS is the actual work

Base UI drives gestures through CSS variables and does **not** position itself.
The popup transform must compose swipe movement and snap offset, or dragging does
nothing:

```css
.drawer-popup[data-swipe-direction="left"],
.drawer-popup[data-swipe-direction="right"] {
  transform: translateX(var(--drawer-swipe-movement-x));
}
.drawer-popup[data-swipe-direction="up"],
.drawer-popup[data-swipe-direction="down"] {
  transform: translateY(
    calc(var(--drawer-snap-point-offset) + var(--drawer-swipe-movement-y))
  );
}

/* dismissal animates off-screen in the swiped direction */
.drawer-popup[data-ending-style][data-swipe-direction="right"] {
  transform: translateX(100%);
}

/* backdrop fades with the drag, not on a fixed timer */
.drawer-backdrop {
  opacity: calc(
    var(--overlays-backdrop-opacity) * (1 - var(--drawer-swipe-progress))
  );
}

/* never transition mid-drag; scale the release by fling velocity */
.drawer-popup[data-swiping],
.drawer-backdrop[data-swiping] {
  transition-duration: 0ms;
}
.drawer-popup[data-ending-style] {
  transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
}
```

Note the popup's `transform` is now owned by the gesture system, so anything that
previously animated via `transform` moves to the viewport or to `opacity`.

Because this is a rewrite rather than a port, the Sheet defects are not carried
over:

- the camelCase `--overlays-backdrop-zIndex` typo dies with the old file; a real
  layering scale replaces it (D3);
- the dead `.sheet-footer` rule and its inline `marginTop: "auto"` duplicate are
  not reproduced (D8);
- `background-color`/`color` are left to `Card` (D8);
- every part gets a `data-slot`, including the popup (D8);
- `--inset: 1rem` moves onto the spacing scale.

### 7.6 Accessibility

`Drawer.Title` and `Drawer.Description` register the ids that `DrawerPopup` emits
as `aria-labelledby` / `aria-describedby` (`drawer/popup/DrawerPopup.js:256-258`).
Feed them into Card's slots via `render` (`TitleProps` / `DescriptionProps`) so
the drawer is correctly labelled while keeping the Card look. Today's Sheet
renders the title as ordinary Card markup, so this is a genuine upgrade.

### 7.7 Risks

- **Preview API.** Contained to one aliased import, and `@base-ui/react` is pinned
  at exactly `1.2.0`. But a version bump becomes a deliberate review point — worth
  a comment at the import site saying so.
- **Gesture tests.** Sheet's suite covers dialog semantics and should largely port
  over, since `DrawerPopup` reuses the dialog store. Swipe behaviour needs
  pointer-event tests and `happy-dom` may not model them well — expect to verify
  gestures manually or in Playwright.
- **Two new DOM layers** will perturb existing `data-slot` selectors.
- **Indent effect is app-shell scope.** Strictly opt-in; do not make
  `DrawerProvider` mandatory the way `ToastProvider` is.

### 7.8 Outcome — landed

Phases 1–3 are done, plus the `Modal` → `Dialog` rename from 7.9.

- `packages/overlays/src/dialog/` and `.../drawer/`; `modal/` and `sheet/` gone.
- Registry entries `Dialog` and `Drawer`; tokens `dialog.tokens.json` and
  `drawer.tokens.json`; `overlays.tokens.json` gained `popup.z-index` so the
  layering scale is real and consumed.
- Consumers migrated: `navigation/sidebar` (now `SidebarMobileDrawer`),
  `interactive/rich-text-editor`, and four blocks-app panels.
- Defects cleared: D2 (dead `--modal-width`), D3 (both the hardcoded z-indexes
  and the camelCase typo — the old file is gone), D4 (`children` passed once),
  D8 (dead `.sheet-footer`, redundant surface styles, missing `data-slot`).

**Verified** — full build 23/23, `pnpm test:run` 887 passed, lint clean (2
pre-existing warnings). Driven in Storybook via Playwright: placement is exact
(16px inset every side, `width: min(28rem, …)` → 448px), `role="dialog"` and
`aria-labelledby` are wired from the Card slots, no console errors. A touch drag
on the bottom sheet moved the popup 1:1 with the finger (140px → `translateY(140px)`,
`--drawer-swipe-movement-y: 140px`, `data-swiping` set) and released into a
dismissal. Gestures work.

Still open: `Toaster` keeps its name for now, and D1/D7 remain prerequisites
before the docs routes.

### 7.9 Original phasing

1. Build `packages/overlays/src/drawer/` on `DrawerPreview` with the full Base UI
   prop surface and Card as renderer; port Sheet's tests across.
2. Write `drawer.module.css` around the gesture variables; add the layering scale.
3. Delete `packages/overlays/src/sheet/`; re-add the registry entry and
   `drawer.tokens.json` under the new component.
4. Then README, examples, stories, docs route — written once, against the final
   API.

This supersedes §6's ordering: the Drawer rewrite lands before step 3 (author
READMEs), so nothing gets documented twice.

### 7.10 Follow-on — `Toaster` is the remaining name

Under this principle, `Modal` is the remaining inconsistency: it wraps
`@base-ui/react/dialog` but is named for the pattern rather than the primitive,
and Base UI ships both `Dialog` and `AlertDialog`. Sheet and Modal were the only
two overlays that renamed their primitive; resolving one invites resolving the
other.

Not proposing it now — flagging it so the taxonomy decision is made deliberately
rather than drifting. Same class of question as `toast`/`Toaster` (A3).

---

## Appendix — Drawer vs Sheet, settled

Recorded because the two were easy to conflate and the distinction drove a PR.

Three distinct things share two words. In order:

|          | `Sheet` (outgoing)              | `Drawer` (removed, PR #277)   | `Drawer` (incoming)                     |
| -------- | ------------------------------- | ----------------------------- | --------------------------------------- |
| Backing  | `@base-ui/react/dialog`         | `vaul` (Radix under the hood) | `@base-ui/react/drawer`                 |
| Status   | active, 355 lines of tests      | `@deprecated`, vaul abandoned | preview (`DrawerPreview`), pinned 1.2.0 |
| Gestures | none                            | drag-to-close                 | swipe, snap points, indent              |
| Fate     | replaced by the incoming Drawer | deleted                       | new, §7                                 |

Removing the vaul Drawer was correct — it was the only non–Base UI overlay. The
name returns, but for Base UI's primitive rather than vaul's. Sheet's tests and
Card-rendered content API carry forward; its `side` prop and `sheet.variants.ts`
do not (§7.2, §7.3).
