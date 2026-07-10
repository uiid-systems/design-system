---
"@uiid/indicators": patch
"@uiid/registry": patch
---

Timeline: feed semantics, marker slot, and hoisted slot props.

- `defaultStatus` on the root sets the status for every item when `activeIndex` is absent, and per-item `status` overrides either derivation — event feeds write `defaultStatus="completed"` instead of faking `activeIndex`. Connectors below completed items render filled.
- Per-item `marker` renders a node (e.g. a small icon) inside the rail dot. The content marker is redesigned: fixed `--timeline-marker-size` circle, tinted `--badge-bg` fill with `--badge-fg` icon when completed/active, muted when pending; the rail widens automatically when any item has a marker.
- Root `gap` prop controls the space between items using spacing tokens, like `Stack`.
- Slot props (`ContentProps`, `TitleProps`, `MarkerProps`, …) are hoisted to the Timeline root and apply to every item in data mode; items accept the same slot props and merge over the root's key-by-key. **Breaking:** `ItemProps` no longer nests slot props — it now forwards plain `<li>` props only (`ItemProps={{ ContentProps }}` becomes `ContentProps={...}` on the root).
- First Timeline unit tests; registry schema now covers `media`, `content`, `marker`, `status`, `defaultStatus`, `gap`, and the hoisted slot props.
