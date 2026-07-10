# Session notes — timeline/more-ui-enhancements

> This file is Claude's narration channel for this session, since Fable's in-conversation
> text isn't rendering in your terminal. I'll update it every turn. Delete when we're done.
> The companion doc about fixing that rendering problem is `FABLE_SUPPORT.md`, next to this file.

---

## Where things stand (updated 2026-07-10, after your hoisting feedback)

**The A + B build is done, verified, and includes your `ItemProps` hoisting request.**
Full build passes, all 871 tests pass (21 of them are the new Timeline tests — the first
tests the `indicators` package has ever had), and the changed files lint clean. The only
lint failures in the repo are pre-existing `tsconfigRootDir` parser errors in
`apps/blocks/app/api/**` that predate this session.

### What the Timeline API looks like now

```tsx
// A feed (bertrand's case) — no more activeIndex hack
<Timeline
  defaultStatus="completed"     // every item reads as done; connectors fill
  gap={6}                       // spacing token, like Stack — replaces pb workarounds
  ContentProps={{ maxw: 680 }}  // hoisted! no more ItemProps={{ ContentProps: {...} }}
  items={events.map((e) => ({
    title: eventTitle(e),
    TitleProps: { color: eventColor(e.event) },  // per-item slot props now work in data mode
    time: <Badge …>{ts}</Badge>,
    color: eventColor(e.event),
    marker: <Icon size={12} />,  // icon INSIDE the rail dot (GitHub-style)
    content: <EventContent event={e} />,
  }))}
/>

// A stepper — unchanged
<Timeline activeIndex={2} items={…} />
```

New capabilities, in the order you approved them:

1. **`defaultStatus` (root) + `status` (per item)** — feeds declare "everything here is
   completed" instead of faking `activeIndex={items.length}`. Per-item `status` overrides
   either derivation (e.g. mark one event `active`). Connectors below completed items
   render filled — one rule everywhere, which exactly reproduces the old `activeIndex`
   behavior for steppers.
2. **`marker` slot (per item)** — a node rendered inside the rail dot. The content marker
   got a real design: fixed 1.5rem circle, tinted `--badge-bg` fill with `--badge-fg` icon
   when completed/active, muted outline when pending, and the rail column widens
   automatically when any item has one (`data-has-markers`). New `--timeline-marker-size`
   token if you want to retheme it.
3. **`gap` (root)** — spacing token driving `--timeline-row-gap`, same convention as
   `Stack`. `gap={6}` ≈ your `pb: 6` (the row gap *is* content padding-block-end under
   the hood, so they compose — use one or the other).
4. **Slot props hoisted to the root** *(your interrupt feedback)* — `ContentProps`,
   `TitleProps`, `MarkerProps`, `ConnectorProps`, `MediaProps`, `TimeProps`,
   `DescriptionProps`, `HeadingProps` all sit directly on `<Timeline>` and apply to every
   item in data mode. Per-item values merge over them key-by-key. **`ItemProps` now
   forwards plain `<li>` props only** — the nesting is gone. This is a breaking change,
   noted in the changeset.

### bertrand migration (one small diff in `dashboard/src/routes/$.tsx`)

```diff
 <Timeline
-  activeIndex={segment.events.length}
+  defaultStatus="completed"
+  gap={6}
+  ContentProps={{ maxw: 680 }}
   items={segment.events.map((e) => ({ … }))}
-  ItemProps={{ ContentProps: { maxw: 680, pb: 6 } }}
 />
```

Two optional upgrades while you're in there:
- **Titles**: replace the hand-built `<Text render={<p/>} weight="bold" color=… balance>`
  nodes with `title: eventTitle(e), TitleProps: { color: eventColor(e.event) }` — you keep
  the design system's title styling and only state the color delta.
- **Markers**: move the event icons from `media` into `marker` (`marker: <Icon size={12}/>`)
  to collapse the icon-beside-a-dot redundancy into one crisp unit on the rail. Try it in
  Storybook first — "Event feed (markers)" is a bertrand-shaped demo I added.

### Housekeeping that rode along

- **Changeset** added (`.changeset/timeline-feed-semantics.md`, patch for
  `@uiid/indicators` + `@uiid/registry`) with the breaking `ItemProps` note.
- **Changelog placeholders fixed** — `0.0.33` shipped with the literal text
  "i Please enter a summary for your changes." in both `indicators` and `typography`;
  both now describe what #257 actually did.
- **Registry schema caught up** — it didn't know `media`/`content` existed; now covers
  those plus `marker`, `status`, `defaultStatus`, `gap`, and the hoisted slot props, with
  updated LLM `usage` guidance.
- **`apps/blocks/COMPONENT_REFERENCE.md` regenerated** — it was two rebuilds stale (still
  documented `orientation` and `DotProps`, removed in #236). Regenerated from the built
  registry; the whole file refreshed, not just Timeline. Note: nothing regenerates this
  file automatically — might be worth a script/CI step someday.

### Not done (deliberately)

- **Cluster C** (TimelineSeparator + `ongoing` fading end-cap) — parked as a follow-up;
  the separator visuals deserve Storybook prototypes you can react to.
- **Animation** — none added, per your project-level sweep plan. The `active` marker ring
  and the future `ongoing` cap are the natural pulse targets when you get there.
- ~~**Nothing committed**~~ **Shipped:** branch `timeline-feed-semantics`, PR
  [#260](https://github.com/uiid-systems/design-system/pull/260). The Event Feed story now
  renders Cards in the prompt/assistant items, mirroring bertrand.

---

## The discussion you asked for: supporting Fable in bertrand

*(You asked for this two turns ago; the answer got eaten by the rendering problem, so
here it is — the full version lives in `FABLE_SUPPORT.md` with implementation details.)*

The forced-AUQ loop stays; it's the anchor of the workflow. The problem is narrower than
"Fable doesn't share its thoughts": Fable narrates plenty, but (a) its extended thinking
doesn't render in the terminal the way Opus's does, and (b) its response text is
interleaved with tool calls and batched into the same assistant messages that end in
`AskUserQuestion` — and your terminal shows the question dialog while dropping that text.
Evidence: the one turn I ended with plain text and no AUQ (the A/B/C proposal) is the one
turn you fully received.

Recommended fix, in layers (details + copy-paste hook language in `FABLE_SUPPORT.md`):
1. **Session-rule patch** (cheap, model-agnostic): require substantive content to be
   delivered via a file or as final-text, and cap the text directly attached to an AUQ
   call at one short lead-in line.
2. **PreToolUse enforcement**: your multiSelect-enforcer hook already receives
   `transcript_path`; it can deny AUQ calls that ride with long unseen text.
3. **Dashboard surfacing**: bertrand already ingests `assistant.message` events — pin the
   last assistant message next to the pending question in the session view so nothing is
   ever lost, regardless of model.

I've saved all of this to memory, so future sessions in this project will use the
file-narration pattern from the start.

---

## Card as the default content vehicle — discussion (2026-07-10, your latest ask)

You proposed: make Card the default vehicle for timeline content, fold `title`/`time`
into the card's own title row instead of the separate heading section, and add a "ghost"
card (essentially transparent) like the form components' ghost variants.

### Why this fits better than you might expect

Card already has the anatomy for it — `title`, `description`, and an `action` slot
(top-right). TimelineItem's loose heading maps onto it almost 1:1:

| Timeline today          | Card slot                              |
| ----------------------- | -------------------------------------- |
| `title` (heading row)   | `title`                                |
| `time` (beside title)   | `action` (top-right) — bertrand's Badge lands naturally |
| `description`           | `description`                          |
| `content` / children    | card body (children)                   |

So the card-vehicle mode doesn't need new Card features — TimelineItem just renders its
existing slots *into* a Card instead of the bare `Group`/`Stack` heading. bertrand's
`EventCard` wrapper (Stack py → Card p=3) gets deleted entirely; the timeline owns the
vehicle. This is the "reuse existing components" principle doing real work.

Sketch:

```tsx
<Timeline card …>                         // root toggle: every item renders as a card
  items={[{ title, time, description, content, marker, color }]}
/>
// per-item override: { card: false } or ghost for quiet rows (see below)
```

Marker alignment is solvable: all geometry is var-driven, so card mode shifts the
marker's anchor line by the card's padding-top (`--timeline-line` gets a card-mode
offset). The dot centers on the card's title row, GitHub-style.

### The ghost question — one honest tension to resolve

A few weeks ago you removed **all** Card toggles (`trimmed`/`inverted`/`transparent`/
`ghost`) in favor of `p`/`b` + consumer styling, and rejected a `bg` prop with "user
styles transparent." Re-adding `ghost` to Card reverses that decision, so it should be
deliberate, not incidental.

The case for reversing it now: since that cleanup, `ghost` has become a *system
convention* — forms expose a boolean `ghost` toggle (`Input`, `Select`, …). A single
boolean `ghost` on Card is no longer "a pile of one-off variants"; it's the same word
meaning the same thing on a different surface. That's the API-uniformity principle
pointing the opposite direction from the earlier cleanup.

The alternative that preserves the old decision: ghost stays *internal to Timeline* — a
per-item `ghost` (or `card: "ghost"`) that the timeline's own CSS implements by flattening
its internally-composed Card (transparent bg, no border, padding preserved so columns
stay aligned). Card's public API stays toggle-free; only Timeline knows the concept.

My take: if you can imagine wanting a transparent-but-structured Card anywhere outside
Timeline (dashboards, list rows, nav panels — likely, honestly), put `ghost` on Card and
accept the reversal as the system catching up with the forms convention. If it's only a
timeline need, keep it internal and revisit when a second consumer appears.

### Decisions I need from you

1. **Default or opt-in?** You said "default vehicle" — true default changes every existing
   Timeline (steppers included) and every current consumer visually. My recommendation:
   ship as a root `card` toggle first, let bertrand and the stories bake on it, then flip
   the default in a follow-up once it feels right. Cheap to flip; hard to un-ship.
2. **Ghost's home**: on Card (system-wide, reverses the old cleanup, matches forms) or
   internal to Timeline (preserves the cleanup, less uniform)?
3. **Time placement**: Card `action` slot (top-right corner, like bertrand's Badge) or
   inline beside the title inside the card header? I lean `action`.

Pick via the question dialog — options map to these decisions — or answer free-form.
