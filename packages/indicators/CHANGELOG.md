# @uiid/indicators

## 0.0.34

### Patch Changes

- [#258](https://github.com/uiid-systems/design-system/pull/258) [`3cb2189`](https://github.com/uiid-systems/design-system/commit/3cb218908b8d2e95b43cb4146a5263418c203da3) Thanks [@adamfratino](https://github.com/adamfratino)! - Add `HeadingProps` to Timeline items, forwarding props to the heading `Group` (the title/time wrapper) so consumers can override its layout.

- [#260](https://github.com/uiid-systems/design-system/pull/260) [`df29cd1`](https://github.com/uiid-systems/design-system/commit/df29cd1d9b90ec5c38114425ee893caf92e9bc9f) Thanks [@adamfratino](https://github.com/adamfratino)! - Timeline: card content vehicle, feed semantics, marker slot, and hoisted slot props.
  - **Every item now renders its content in a `Card`** — `title` and `time` fill the card header (time in the action corner), `description` sits under the title, and `content`/children fill the body. A new `CardProps` slot (root or per item) customizes it; `CardProps={{ variant: "ghost" }}` gives flat rows. `TimelineTitle` and `TimelineDescription` are removed — the Card renders those slots now. Markers, media, and connectors anchor to the card's title row via `--timeline-anchor-offset`.
  - `defaultStatus` on the root sets the status for every item when `activeIndex` is absent, and per-item `status` overrides either derivation — event feeds write `defaultStatus="completed"` instead of faking `activeIndex`. Connectors below completed items render filled.
  - Per-item `marker` renders a node (e.g. a small icon) inside the rail dot. The content marker is redesigned: fixed `--timeline-marker-size` circle, tinted `--badge-bg` fill with `--badge-fg` icon when completed/active, muted when pending; the rail widens automatically when any item has a marker.
  - Root `gap` prop controls the space between items using spacing tokens, like `Stack`.
  - Slot props (`ContentProps`, `TitleProps`, `MarkerProps`, …) are hoisted to the Timeline root and apply to every item in data mode; items accept the same slot props and merge over the root's key-by-key. **Breaking:** `ItemProps` no longer nests slot props — it now forwards plain `<li>` props only (`ItemProps={{ ContentProps }}` becomes `ContentProps={...}` on the root).
  - First Timeline unit tests; registry schema now covers `media`, `content`, `marker`, `status`, `defaultStatus`, `gap`, and the hoisted slot props.

- Updated dependencies [[`df29cd1`](https://github.com/uiid-systems/design-system/commit/df29cd1d9b90ec5c38114425ee893caf92e9bc9f), [`3cb2189`](https://github.com/uiid-systems/design-system/commit/3cb218908b8d2e95b43cb4146a5263418c203da3), [`3cb2189`](https://github.com/uiid-systems/design-system/commit/3cb218908b8d2e95b43cb4146a5263418c203da3), [`3cb2189`](https://github.com/uiid-systems/design-system/commit/3cb218908b8d2e95b43cb4146a5263418c203da3)]:
  - @uiid/cards@0.0.34
  - @uiid/tokens@0.0.34
  - @uiid/typography@0.0.34
  - @uiid/utils@0.0.34

## 0.0.33

### Patch Changes

- [#257](https://github.com/uiid-systems/design-system/pull/257) [`c638753`](https://github.com/uiid-systems/design-system/commit/c638753f33bd4d6e45d02e3d92960852de116ba6) Thanks [@adamfratino](https://github.com/adamfratino)! - Add `HeadingProps` slot to `TimelineItem` for overriding the title/time heading row.

- Updated dependencies [[`44ed916`](https://github.com/uiid-systems/design-system/commit/44ed9164b57a49258b0bd90bba695b186a3c2cdf), [`c638753`](https://github.com/uiid-systems/design-system/commit/c638753f33bd4d6e45d02e3d92960852de116ba6)]:
  - @uiid/typography@0.0.33
  - @uiid/cards@0.0.33
  - @uiid/tokens@0.0.33
  - @uiid/utils@0.0.33

## 0.0.32

### Patch Changes

- Updated dependencies []:
  - @uiid/cards@0.0.32
  - @uiid/tokens@0.0.32
  - @uiid/typography@0.0.32
  - @uiid/utils@0.0.32

## 0.0.31

### Patch Changes

- Updated dependencies [[`e3d09bf`](https://github.com/uiid-systems/design-system/commit/e3d09bfdb8dfdc38440c77226738e90f45cdc998), [`3bf512a`](https://github.com/uiid-systems/design-system/commit/3bf512aa1427d9ba1f52e4929abe8360fb1bdddc)]:
  - @uiid/tokens@0.0.31
  - @uiid/typography@0.0.31
  - @uiid/cards@0.0.31
  - @uiid/utils@0.0.31

## 0.0.30

### Patch Changes

- Updated dependencies [[`f748549`](https://github.com/uiid-systems/design-system/commit/f748549795c163f5888f758ddba74fa1acff5f9f)]:
  - @uiid/cards@0.0.30
  - @uiid/tokens@0.0.30
  - @uiid/typography@0.0.30
  - @uiid/utils@0.0.30

## 0.0.29

### Patch Changes

- Updated dependencies [[`60f51d5`](https://github.com/uiid-systems/design-system/commit/60f51d5fb6aac0bb78a2c8714787ab683ef2ca7c), [`693ad6f`](https://github.com/uiid-systems/design-system/commit/693ad6fd35585601ab18e8f8b09834b0e6b61a6e)]:
  - @uiid/tokens@0.0.29
  - @uiid/cards@0.0.29
  - @uiid/typography@0.0.29
  - @uiid/utils@0.0.29

## 0.0.28

### Patch Changes

- Updated dependencies [[`62d4892`](https://github.com/uiid-systems/design-system/commit/62d489279afcaa7ba8f875ddad2a0b610c051768), [`8d30a84`](https://github.com/uiid-systems/design-system/commit/8d30a8458f94682612ac022879f84a981b41bb24)]:
  - @uiid/cards@0.0.28
  - @uiid/tokens@0.0.28
  - @uiid/typography@0.0.28
  - @uiid/utils@0.0.28

## 0.0.27

### Patch Changes

- [#236](https://github.com/uiid-systems/design-system/pull/236) [`fc746f4`](https://github.com/uiid-systems/design-system/commit/fc746f48c3af9cfa215e375d5c888e76f4800dfc) Thanks [@adamfratino](https://github.com/adamfratino)! - Rebuild Timeline on a subgrid `media` / rail / content layout: a prominent leading media column (avatar/icon) right-aligned to the rail, a continuous connector masked behind status-colored dots, and dot/media centered on the title's first line. Removes `orientation` (vertical-only), the internal subscription store, and the dead `TimelineHeader`; renames `TimelineDot` → `TimelineMarker` and adds `TimelineMedia`. Also removes the inert Avatar `size` prop (fixing its underlying token-mismatch sizing bug) and makes Avatar `name`/`description` optional.

- Updated dependencies [[`0ebdc4c`](https://github.com/uiid-systems/design-system/commit/0ebdc4c14209eece848e8d288e6a814a0e021ca6), [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a), [`6fdd5df`](https://github.com/uiid-systems/design-system/commit/6fdd5df7f2468ae6a836492845363d58f5dde904), [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a), [`247daed`](https://github.com/uiid-systems/design-system/commit/247daedd33450a0794ca81a532ba9b0328967a52)]:
  - @uiid/tokens@0.0.27
  - @uiid/cards@0.0.27
  - @uiid/typography@0.0.27
  - @uiid/utils@0.0.27

## 0.0.26

### Patch Changes

- [`2808033`](https://github.com/uiid-systems/design-system/commit/2808033e3a20be69ed9f20d6d25220244072e7f1) Thanks [@adamfratino](https://github.com/adamfratino)! - simplify breadcrumbs caret

- Updated dependencies [[`2808033`](https://github.com/uiid-systems/design-system/commit/2808033e3a20be69ed9f20d6d25220244072e7f1), [`e740c85`](https://github.com/uiid-systems/design-system/commit/e740c8594ae614462e63543436cc4816c6a7ab02), [`486ea23`](https://github.com/uiid-systems/design-system/commit/486ea2349e200b75f54f2f4073a318f2238376ef)]:
  - @uiid/cards@0.0.26
  - @uiid/tokens@0.0.26
  - @uiid/typography@0.0.26
  - @uiid/utils@0.0.26

## 0.0.25

### Patch Changes

- Updated dependencies []:
  - @uiid/cards@0.0.25
  - @uiid/tokens@0.0.25
  - @uiid/typography@0.0.25
  - @uiid/utils@0.0.25

## 0.0.24

### Patch Changes

- Updated dependencies [[`ba0c026`](https://github.com/uiid-systems/design-system/commit/ba0c0265e6b1f19afec07637d73c02d113212016)]:
  - @uiid/cards@0.0.24
  - @uiid/tokens@0.0.24
  - @uiid/typography@0.0.24
  - @uiid/utils@0.0.24

## 0.0.23

### Patch Changes

- [#220](https://github.com/uiid-systems/design-system/pull/220) [`1d0c6e2`](https://github.com/uiid-systems/design-system/commit/1d0c6e24e6212f7f12530259110ac1cbc1344c0d) Thanks [@adamfratino](https://github.com/adamfratino)! - Tighten `Badge` sizing to feel sane at `small`. Reduces padding-y across all sizes (small `0.375rem` → `0.125rem`), trims padding-x on medium/large, drops border-radius from `0.5rem` → `0.375rem`, and adds a new `--badge-line-height` token (`1.25`) applied to both `.badge` and `.badge-text` so the inner `<Text>` no longer forces 1.5 line-height padding into the box. The small badge now lands around 18–20px tall — proportional to shadcn's default badge.

- Updated dependencies [[`1d0c6e2`](https://github.com/uiid-systems/design-system/commit/1d0c6e24e6212f7f12530259110ac1cbc1344c0d), [`de26147`](https://github.com/uiid-systems/design-system/commit/de261474d8621bc40da0e24f20ecdb2f6b921aad), [`f4ef8ce`](https://github.com/uiid-systems/design-system/commit/f4ef8ce332a0f1fa88d5323e6105120b972a74b9), [`23351be`](https://github.com/uiid-systems/design-system/commit/23351bef77f49a5e90ace39a8c223441e88cf094), [`101b095`](https://github.com/uiid-systems/design-system/commit/101b0956bedd5690878d910b4e420aa54e9df2a6), [`e61d7f5`](https://github.com/uiid-systems/design-system/commit/e61d7f50c25c96377272aea5c8c071298659fae4)]:
  - @uiid/tokens@0.0.23
  - @uiid/cards@0.0.23
  - @uiid/typography@0.0.23
  - @uiid/utils@0.0.23

## 0.0.22

### Patch Changes

- Updated dependencies []:
  - @uiid/cards@0.0.22
  - @uiid/tokens@0.0.22
  - @uiid/typography@0.0.22
  - @uiid/utils@0.0.22

## 0.0.21

### Patch Changes

- Updated dependencies []:
  - @uiid/cards@0.0.21
  - @uiid/tokens@0.0.21
  - @uiid/typography@0.0.21
  - @uiid/utils@0.0.21

## 0.0.20

### Patch Changes

- [#200](https://github.com/uiid-systems/design-system/pull/200) [`6a55e55`](https://github.com/uiid-systems/design-system/commit/6a55e5586706f134b7a93140e8c42245f4ee3ec7) Thanks [@adamfratino](https://github.com/adamfratino)! - add card variant to timeline

- Updated dependencies []:
  - @uiid/cards@0.0.20
  - @uiid/tokens@0.0.20
  - @uiid/typography@0.0.20
  - @uiid/utils@0.0.20

## 0.0.19

### Patch Changes

- [#198](https://github.com/uiid-systems/design-system/pull/198) [`00add6f`](https://github.com/uiid-systems/design-system/commit/00add6f06f946f2ae1f1c43d6f5659ede4169ced) Thanks [@adamfratino](https://github.com/adamfratino)! - Add content slot to timeline items and reduce dot z-index. TimelineContentProps now extends StackProps for layout prop support.

- Updated dependencies [[`e43f0d2`](https://github.com/uiid-systems/design-system/commit/e43f0d28bee9ee88a9ffe4d928344de6962ef2fc)]:
  - @uiid/cards@0.0.19
  - @uiid/tokens@0.0.19
  - @uiid/typography@0.0.19
  - @uiid/utils@0.0.19

## 0.0.18

### Patch Changes

- [#188](https://github.com/uiid-systems/design-system/pull/188) [`cf359fa`](https://github.com/uiid-systems/design-system/commit/cf359fac1a8343169bf63ad4f16619f8d633b951) Thanks [@adamfratino](https://github.com/adamfratino)! - Add color prop to Text component with palette colors (red, orange, yellow, green, blue, indigo, purple, neutral). Move shared palette color system from Badge to Text as the primitive owner. Badge, Status, and other indicator components now consume palette definitions from typography.

- Updated dependencies [[`cf359fa`](https://github.com/uiid-systems/design-system/commit/cf359fac1a8343169bf63ad4f16619f8d633b951)]:
  - @uiid/typography@0.0.18
  - @uiid/cards@0.0.18
  - @uiid/tokens@0.0.18
  - @uiid/utils@0.0.18

## 0.0.17

### Patch Changes

- Updated dependencies [[`d61e1d7`](https://github.com/uiid-systems/design-system/commit/d61e1d71fbc5d60fde02768c74e4eca8aa50578d), [`e19fa9c`](https://github.com/uiid-systems/design-system/commit/e19fa9cb3a5bbe7f7e613740fadde507d70031a0)]:
  - @uiid/tokens@0.0.17
  - @uiid/typography@0.0.17
  - @uiid/cards@0.0.17
  - @uiid/utils@0.0.17

## 0.0.16

### Patch Changes

- [#173](https://github.com/uiid-systems/design-system/pull/173) [`6e1874a`](https://github.com/uiid-systems/design-system/commit/6e1874a7fcfb20755f418b2c5ea3df07c31dac0b) Thanks [@adamfratino](https://github.com/adamfratino)! - Add neutral color variant and shared PaletteColor system across indicator components. Remove badge inverted variant. Add Kbd active state with hotkey detection. Boost badge/status oklch color saturation. Restyle tabs and toggle-group with filled pill indicator, ghost prop, and remove tabs align prop. Fix input/select specificity conflict.

- Updated dependencies [[`652f428`](https://github.com/uiid-systems/design-system/commit/652f4286b8c56c337f1e6fe12e41ab77f7e52fe6)]:
  - @uiid/tokens@0.0.16
  - @uiid/cards@0.0.16
  - @uiid/typography@0.0.16
  - @uiid/utils@0.0.16

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @uiid/cards@0.0.15
  - @uiid/tokens@0.0.15
  - @uiid/typography@0.0.15
  - @uiid/utils@0.0.15

## 0.0.14

### Patch Changes

- [#167](https://github.com/uiid-systems/design-system/pull/167) [`0b88a10`](https://github.com/uiid-systems/design-system/commit/0b88a10f830003bb07f7f72faf1698951fe0c2a4) Thanks [@adamfratino](https://github.com/adamfratino)! - Add color prop to Status component, sharing Badge's oklch color system

- Updated dependencies []:
  - @uiid/cards@0.0.14
  - @uiid/tokens@0.0.14
  - @uiid/typography@0.0.14
  - @uiid/utils@0.0.14

## 0.0.13

### Patch Changes

- [#162](https://github.com/uiid-systems/design-system/pull/162) [`8a1be59`](https://github.com/uiid-systems/design-system/commit/8a1be592a3aec2f8add47df394fee79a2b3feff0) Thanks [@adamfratino](https://github.com/adamfratino)! - badge refactor

- Updated dependencies [[`8a1be59`](https://github.com/uiid-systems/design-system/commit/8a1be592a3aec2f8add47df394fee79a2b3feff0)]:
  - @uiid/tokens@0.0.13
  - @uiid/cards@0.0.13
  - @uiid/typography@0.0.13
  - @uiid/utils@0.0.13

## 0.0.12

### Patch Changes

- [#150](https://github.com/uiid-systems/design-system/pull/150) [`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4) Thanks [@adamfratino](https://github.com/adamfratino)! - Remove tone system (positive/critical/warning/info) from all components and tokens. Form validation errors now use shade-based styling.

- [#149](https://github.com/uiid-systems/design-system/pull/149) [`3a3a4df`](https://github.com/uiid-systems/design-system/commit/3a3a4dffde260e22e7886f74461fcfdb143614c1) Thanks [@adamfratino](https://github.com/adamfratino)! - Unify transition tokens across all components to use shared semantic globals

- Updated dependencies [[`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4), [`3a3a4df`](https://github.com/uiid-systems/design-system/commit/3a3a4dffde260e22e7886f74461fcfdb143614c1)]:
  - @uiid/tokens@0.0.12
  - @uiid/cards@0.0.12
  - @uiid/typography@0.0.12
  - @uiid/utils@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies [[`e2c1394`](https://github.com/uiid-systems/design-system/commit/e2c13948302371959e2b006de776aeab6c8a3c81)]:
  - @uiid/tokens@0.0.11
  - @uiid/cards@0.0.11
  - @uiid/typography@0.0.11
  - @uiid/utils@0.0.11

## 0.0.10

### Patch Changes

- Updated dependencies [[`0af03b7`](https://github.com/uiid-systems/design-system/commit/0af03b75ae17444678846a7a8602200798312b51), [`bf38c58`](https://github.com/uiid-systems/design-system/commit/bf38c58367bfe4c02b7ebc55362d735ac855ff3b), [`e02fb0d`](https://github.com/uiid-systems/design-system/commit/e02fb0ddfd9f07e5f1daba78dfea8dedabe139ef), [`16449d9`](https://github.com/uiid-systems/design-system/commit/16449d922a0664bee47673e2a802af63cfe794da), [`6b81080`](https://github.com/uiid-systems/design-system/commit/6b81080780b4a173873a822bf346404e0381aa43), [`b05f3d3`](https://github.com/uiid-systems/design-system/commit/b05f3d334b12aed413ff49611c2c786c7fb0f994)]:
  - @uiid/tokens@0.0.10
  - @uiid/cards@0.0.10
  - @uiid/typography@0.0.10
  - @uiid/utils@0.0.10

## 0.0.8

### Patch Changes

- [#95](https://github.com/uiid-systems/design-system/pull/95) [`3989ce1`](https://github.com/uiid-systems/design-system/commit/3989ce127ab06f41ca006dae2681f1c3271fc7a1) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: establish code review workflow and PR review guide (#95)

- [#98](https://github.com/uiid-systems/design-system/pull/98) [`d931595`](https://github.com/uiid-systems/design-system/commit/d9315954b8ef775f8282723079e35b753473d195) Thanks [@adamfratino](https://github.com/adamfratino)! - ci: fix workflows not running on Dependabot PRs (#98)

- [#94](https://github.com/uiid-systems/design-system/pull/94) [`833327c`](https://github.com/uiid-systems/design-system/commit/833327c5056a78b6069e7497966139c4e108982e) Thanks [@adamfratino](https://github.com/adamfratino)! - refactor: simplify versioning and changelog pipeline (#94)

- [#93](https://github.com/uiid-systems/design-system/pull/93) [`4c3ed11`](https://github.com/uiid-systems/design-system/commit/4c3ed11df32fd06d9513bea1b94797327fbafc0f) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: rename playground to blocks, rewrite README, add vision doc (#93)

  ## Summary

- Updated dependencies [[`a411bf3`](https://github.com/uiid-systems/design-system/commit/a411bf3e887a3d8a9722824c3ea2e5096ff08142), [`85038b4`](https://github.com/uiid-systems/design-system/commit/85038b4dc5f10092e508d5a5e3ea39ff3d668cbd), [`3989ce1`](https://github.com/uiid-systems/design-system/commit/3989ce127ab06f41ca006dae2681f1c3271fc7a1), [`d931595`](https://github.com/uiid-systems/design-system/commit/d9315954b8ef775f8282723079e35b753473d195), [`833327c`](https://github.com/uiid-systems/design-system/commit/833327c5056a78b6069e7497966139c4e108982e), [`4c3ed11`](https://github.com/uiid-systems/design-system/commit/4c3ed11df32fd06d9513bea1b94797327fbafc0f), [`160fe8a`](https://github.com/uiid-systems/design-system/commit/160fe8a27f84bc3035d9b2e85182004491784b88), [`33ba183`](https://github.com/uiid-systems/design-system/commit/33ba1833b162fee82c0dee10c4893e58baef8b7c)]:
  - @uiid/tokens@0.0.8
  - @uiid/cards@0.0.8
  - @uiid/typography@0.0.8
  - @uiid/utils@0.0.8

## 0.0.7

### Patch Changes

- fix: release again (#89)

## 0.0.6

### Patch Changes

- fix: release (#87)

## 0.0.5

### Patch Changes

- chore: prep all packages for npm publishing (#85)
- feat: add blocks using screenshots (#77)
- docs: update docs (#68)
- feat: add icons to playground (#72)
- feat: block registry (#66)
- feat: add more components to registry, separator children, other stuff (#78)
- chore(deps): bump the all-dependencies group across 1 directory with 25 updates (#76)
- refactor: playground enhancements (#82)
- refactor: playground routing (#84)
- fix: json-render migration (#81)

## 0.0.4

## 0.0.3

### Patch Changes

- feat: add mdx support to docs, test on button (#37)
- refactor: cleanup tokens (#45)
- chore(deps-dev): bump vite from 7.1.2 to 7.1.11 (#47)
- chore(deps): bump next from 16.1.3 to 16.1.5 (#48)
- refactor: tokens (#50)
- feat: link component docs to builder (#35)

## 0.0.2

### Patch Changes

- refactor: swap accent and muted colors (#25)
- fix: changelogs (#20)

## 0.0.1

### Patch Changes

- chore: remove changelog story
