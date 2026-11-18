# Component Dependency Graph

Which UIID UI packages rely on other UI packages. An arrow `A --> B` means "A imports B at runtime". Derived from the `@uiid/*` imports in each package's `src`, not from `package.json`, so a declared dependency that nothing imports does not show up here.

Test, example, and story files (`*.test.tsx`, `*.examples.tsx`, `*.stories.tsx`) are excluded, since they never ship. Non-visual packages (`tokens`, `utils`) and the `design-system` barrel are excluded too — this is only the UI component library. `ai` is private and not re-exported from the barrel, so it is drawn with a dashed border.

`layout`, `typography`, and `icons` are the primitives; they get the most incoming arrows because almost everything is built on them.

```mermaid
graph TD
  icons[icons]
  typography[typography]
  layout[layout]
  buttons[buttons]
  cards[cards]
  lists[lists]
  markdown[markdown]
  overlays[overlays]
  indicators[indicators]
  forms[forms]
  interactive[interactive]
  navigation[navigation]
  tables[tables]
  code[code]
  ai[ai]

  buttons --> icons & layout & typography
  lists --> icons & layout & typography
  markdown --> typography

  cards --> buttons & icons & layout & typography

  overlays --> buttons & cards & icons & layout & typography
  indicators --> cards & layout & typography

  forms --> cards & icons & layout & lists & overlays & typography

  interactive --> icons & layout

  navigation --> buttons & cards & icons & layout & typography

  tables --> buttons & cards & forms & icons & layout & navigation

  code --> buttons & icons & layout & typography

  ai --> buttons & forms & icons & indicators & interactive & layout & markdown & typography

  classDef private stroke-dasharray: 5 5
  class ai private
```

## Notes

- Cycle-free. `cards` uses `buttons` (CollapsibleCard's trigger), `overlays` uses `buttons` and `cards`, and nothing points back up: `buttons` depends only on the primitives.
- `layout`, `typography`, and `icons` are leaves — they rely on no other UI package. (`layout` composes shared text styles from `@uiid/tokens`, so it does not depend on `typography`.)
- `markdown` is the lightest non-leaf, reaching only `typography`. `interactive` reaches only `icons` and `layout`.
- To regenerate, list each package's runtime `@uiid/*` imports and drop `tokens`, `utils`, and the package itself:

  ```sh
  for p in packages/*/src; do
    pkg=$(basename "$(dirname "$p")")
    echo "$pkg: $(grep -rhoE "[\"']@uiid/[a-z-]+" "$p" \
      --include='*.ts' --include='*.tsx' --include='*.css' \
      --exclude='*.test.*' --exclude='*.examples.*' --exclude='*.stories.*' \
      | sed -E "s/.*@uiid\///" | sort -u | grep -vxE "tokens|utils|$pkg" | tr '\n' ' ')"
  done
  ```
