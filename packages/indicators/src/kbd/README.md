# Kbd

> A keyboard key or shortcut, drawn as a keycap. It can light up while the user holds the shortcut it shows.

Use Kbd when you want to:

- Show a shortcut next to the action it triggers, from a list of keys in `hotkey` — `["meta", "k"]` renders `⌘ + K`
- Have the keycap light up while that shortcut is held, so users can try it in place — Kbd listens on `window` whenever `hotkey` is set
- Drive the lit state yourself with `active`, which turns the listener off — for a key the app presses on the user's behalf, or a still frame in documentation

The modifiers are `meta`, `ctrl`, `alt` and `shift`. They render as `⌘`, `⌃`, `⌥` and `⇧`, and a hotkey matches only when exactly those modifiers are held. Named keys (`enter`, `backspace`, `delete`, `escape`, `tab`, `space`, `arrowup`, `arrowdown`, `arrowleft`, `arrowright`) render as symbols; any other key is uppercased. Keys are case-insensitive. A hotkey of modifiers alone matches when the last of them goes down.

The keycap only reflects the shortcut. It does not run it, so bind the action itself elsewhere.

Kbd renders a `<kbd>` and takes its props, apart from `children`: the keys come from `hotkey`. It ignores the pointer and cannot be selected, so it never steals a click from the control it labels.

Known limitation: a `space` hotkey never lights up, because the space bar's `event.key` is `" "`, and on macOS an `alt` + letter hotkey never lights up, because Option changes `event.key` (Option+B gives `∫`). See UI-400.
