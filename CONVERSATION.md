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
- **Nothing committed** — the working tree holds everything; say the word and I'll branch,
  commit, and open a PR.

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
