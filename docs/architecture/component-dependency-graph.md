# Component Dependency Graph

Which UIID UI components rely on other UI components. An arrow `A --> B` means
"A uses B". Derived from the `@uiid` entries in each package's `package.json`.

Non-visual packages (`tokens`, `themes`, `utils`) and the barrel/tooling packages
(`design-system`, `registry`, `blocks`, `mcp`) are excluded — this is only the UI
component library.

`layout`, `typography`, and `icons` are the primitives; they get the most incoming
arrows because almost everything is built on them.

```mermaid
graph TD
  icons[icons]
  typography[typography]
  layout[layout]
  cards[cards]
  overlays[overlays]
  buttons[buttons]
  indicators[indicators]
  lists[lists]
  forms[forms]
  interactive[interactive]
  navigation[navigation]
  tables[tables]
  code[code]
  calendars[calendars]

  layout --> icons & typography

  cards --> icons & layout & typography
  lists --> icons & layout & typography

  overlays --> cards & icons & layout & typography
  indicators --> cards & typography

  buttons --> icons & layout & overlays & typography

  forms --> buttons & cards & icons & layout & lists & overlays & typography

  interactive --> buttons & cards & forms & icons & indicators & layout & overlays & typography

  navigation --> buttons & forms & icons & indicators & layout & lists & overlays & typography

  tables --> buttons & cards & forms & icons & interactive & layout & overlays & typography

  code --> buttons & cards & icons & layout & typography

  calendars --> buttons & cards & icons & indicators & interactive & layout & overlays & typography
```

## Notes

- Cycle-free — `buttons` uses `overlays` (the built-in tooltip), `overlays` uses
  `cards`, and nothing points back up.
- `typography` and `icons` are leaves — they rely on no other UI component.
- To regenerate, inspect the `@uiid/*` entries in each `packages/*/package.json`,
  dropping `tokens`, `themes`, and `utils`.
