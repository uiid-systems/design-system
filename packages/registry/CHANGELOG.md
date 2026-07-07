# @uiid/registry

## 0.0.30

### Patch Changes

- [#244](https://github.com/uiid-systems/design-system/pull/244) [`f748549`](https://github.com/uiid-systems/design-system/commit/f748549795c163f5888f758ddba74fa1acff5f9f) Thanks [@adamfratino](https://github.com/adamfratino)! - Add a palette-driven `color` prop to Card (one hue resolves background, foreground, and border via oklch + light-dark) and retire the vestigial tone token concept. Form validation (invalid radio/checkbox and the required-field asterisk) now uses the raw `--color-red` primitive instead of the undefined `--tone-critical`.

- Updated dependencies [[`f748549`](https://github.com/uiid-systems/design-system/commit/f748549795c163f5888f758ddba74fa1acff5f9f)]:
  - @uiid/cards@0.0.30
  - @uiid/forms@0.0.30
  - @uiid/buttons@0.0.30
  - @uiid/layout@0.0.30
  - @uiid/typography@0.0.30
  - @uiid/utils@0.0.30

## 0.0.29

### Patch Changes

- Updated dependencies [[`60f51d5`](https://github.com/uiid-systems/design-system/commit/60f51d5fb6aac0bb78a2c8714787ab683ef2ca7c), [`693ad6f`](https://github.com/uiid-systems/design-system/commit/693ad6fd35585601ab18e8f8b09834b0e6b61a6e)]:
  - @uiid/forms@0.0.29
  - @uiid/buttons@0.0.29
  - @uiid/cards@0.0.29
  - @uiid/layout@0.0.29
  - @uiid/typography@0.0.29
  - @uiid/utils@0.0.29

## 0.0.28

### Patch Changes

- Updated dependencies [[`62d4892`](https://github.com/uiid-systems/design-system/commit/62d489279afcaa7ba8f875ddad2a0b610c051768), [`8d30a84`](https://github.com/uiid-systems/design-system/commit/8d30a8458f94682612ac022879f84a981b41bb24)]:
  - @uiid/cards@0.0.28
  - @uiid/forms@0.0.28
  - @uiid/buttons@0.0.28
  - @uiid/layout@0.0.28
  - @uiid/typography@0.0.28
  - @uiid/utils@0.0.28

## 0.0.27

### Patch Changes

- [#236](https://github.com/uiid-systems/design-system/pull/236) [`fc746f4`](https://github.com/uiid-systems/design-system/commit/fc746f48c3af9cfa215e375d5c888e76f4800dfc) Thanks [@adamfratino](https://github.com/adamfratino)! - Rebuild Timeline on a subgrid `media` / rail / content layout: a prominent leading media column (avatar/icon) right-aligned to the rail, a continuous connector masked behind status-colored dots, and dot/media centered on the title's first line. Removes `orientation` (vertical-only), the internal subscription store, and the dead `TimelineHeader`; renames `TimelineDot` → `TimelineMarker` and adds `TimelineMedia`. Also removes the inert Avatar `size` prop (fixing its underlying token-mismatch sizing bug) and makes Avatar `name`/`description` optional.

- Updated dependencies [[`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a), [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a), [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a), [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a), [`6fdd5df`](https://github.com/uiid-systems/design-system/commit/6fdd5df7f2468ae6a836492845363d58f5dde904), [`247daed`](https://github.com/uiid-systems/design-system/commit/247daedd33450a0794ca81a532ba9b0328967a52)]:
  - @uiid/cards@0.0.27
  - @uiid/forms@0.0.27
  - @uiid/typography@0.0.27
  - @uiid/buttons@0.0.27
  - @uiid/layout@0.0.27
  - @uiid/utils@0.0.27

## 0.0.26

### Patch Changes

- [`2808033`](https://github.com/uiid-systems/design-system/commit/2808033e3a20be69ed9f20d6d25220244072e7f1) Thanks [@adamfratino](https://github.com/adamfratino)! - simplify breadcrumbs caret

- Updated dependencies [[`2808033`](https://github.com/uiid-systems/design-system/commit/2808033e3a20be69ed9f20d6d25220244072e7f1), [`e740c85`](https://github.com/uiid-systems/design-system/commit/e740c8594ae614462e63543436cc4816c6a7ab02), [`486ea23`](https://github.com/uiid-systems/design-system/commit/486ea2349e200b75f54f2f4073a318f2238376ef)]:
  - @uiid/buttons@0.0.26
  - @uiid/cards@0.0.26
  - @uiid/forms@0.0.26
  - @uiid/layout@0.0.26
  - @uiid/typography@0.0.26
  - @uiid/utils@0.0.26

## 0.0.25

### Patch Changes

- Updated dependencies []:
  - @uiid/buttons@0.0.25
  - @uiid/cards@0.0.25
  - @uiid/forms@0.0.25
  - @uiid/layout@0.0.25
  - @uiid/typography@0.0.25
  - @uiid/utils@0.0.25

## 0.0.24

### Patch Changes

- Updated dependencies [[`ba0c026`](https://github.com/uiid-systems/design-system/commit/ba0c0265e6b1f19afec07637d73c02d113212016)]:
  - @uiid/cards@0.0.24
  - @uiid/forms@0.0.24
  - @uiid/buttons@0.0.24
  - @uiid/layout@0.0.24
  - @uiid/typography@0.0.24
  - @uiid/utils@0.0.24

## 0.0.23

### Patch Changes

- Updated dependencies [[`de26147`](https://github.com/uiid-systems/design-system/commit/de261474d8621bc40da0e24f20ecdb2f6b921aad), [`f4ef8ce`](https://github.com/uiid-systems/design-system/commit/f4ef8ce332a0f1fa88d5323e6105120b972a74b9), [`10bd3dc`](https://github.com/uiid-systems/design-system/commit/10bd3dc9b358e08278b9b59e0ec4668c97d58c22), [`23351be`](https://github.com/uiid-systems/design-system/commit/23351bef77f49a5e90ace39a8c223441e88cf094), [`e61d7f5`](https://github.com/uiid-systems/design-system/commit/e61d7f50c25c96377272aea5c8c071298659fae4)]:
  - @uiid/cards@0.0.23
  - @uiid/buttons@0.0.23
  - @uiid/forms@0.0.23
  - @uiid/layout@0.0.23
  - @uiid/typography@0.0.23
  - @uiid/utils@0.0.23

## 0.0.22

### Patch Changes

- Updated dependencies []:
  - @uiid/forms@0.0.22
  - @uiid/buttons@0.0.22
  - @uiid/cards@0.0.22
  - @uiid/layout@0.0.22
  - @uiid/typography@0.0.22
  - @uiid/utils@0.0.22

## 0.0.21

### Patch Changes

- Updated dependencies []:
  - @uiid/buttons@0.0.21
  - @uiid/cards@0.0.21
  - @uiid/forms@0.0.21
  - @uiid/layout@0.0.21
  - @uiid/typography@0.0.21
  - @uiid/utils@0.0.21

## 0.0.20

### Patch Changes

- Updated dependencies []:
  - @uiid/forms@0.0.20
  - @uiid/buttons@0.0.20
  - @uiid/cards@0.0.20
  - @uiid/layout@0.0.20
  - @uiid/typography@0.0.20
  - @uiid/utils@0.0.20

## 0.0.19

### Patch Changes

- [#191](https://github.com/uiid-systems/design-system/pull/191) [`e43f0d2`](https://github.com/uiid-systems/design-system/commit/e43f0d28bee9ee88a9ffe4d928344de6962ef2fc) Thanks [@adamfratino](https://github.com/adamfratino)! - Add optional libs field to registry component entries

- Updated dependencies [[`e43f0d2`](https://github.com/uiid-systems/design-system/commit/e43f0d28bee9ee88a9ffe4d928344de6962ef2fc)]:
  - @uiid/cards@0.0.19
  - @uiid/forms@0.0.19
  - @uiid/buttons@0.0.19
  - @uiid/layout@0.0.19
  - @uiid/typography@0.0.19
  - @uiid/utils@0.0.19

## 0.0.18

### Patch Changes

- Updated dependencies [[`cf359fa`](https://github.com/uiid-systems/design-system/commit/cf359fac1a8343169bf63ad4f16619f8d633b951), [`274bc07`](https://github.com/uiid-systems/design-system/commit/274bc077ead25d1dd9d25881373561bfd35239e5), [`cf359fa`](https://github.com/uiid-systems/design-system/commit/cf359fac1a8343169bf63ad4f16619f8d633b951)]:
  - @uiid/forms@0.0.18
  - @uiid/typography@0.0.18
  - @uiid/buttons@0.0.18
  - @uiid/cards@0.0.18
  - @uiid/layout@0.0.18
  - @uiid/utils@0.0.18

## 0.0.17

### Patch Changes

- Updated dependencies [[`7cbd9c1`](https://github.com/uiid-systems/design-system/commit/7cbd9c109cb59fa559416b393292828593535949), [`d61e1d7`](https://github.com/uiid-systems/design-system/commit/d61e1d71fbc5d60fde02768c74e4eca8aa50578d), [`e19fa9c`](https://github.com/uiid-systems/design-system/commit/e19fa9cb3a5bbe7f7e613740fadde507d70031a0)]:
  - @uiid/forms@0.0.17
  - @uiid/typography@0.0.17
  - @uiid/layout@0.0.17
  - @uiid/buttons@0.0.17
  - @uiid/cards@0.0.17
  - @uiid/utils@0.0.17

## 0.0.16

### Patch Changes

- [#173](https://github.com/uiid-systems/design-system/pull/173) [`6e1874a`](https://github.com/uiid-systems/design-system/commit/6e1874a7fcfb20755f418b2c5ea3df07c31dac0b) Thanks [@adamfratino](https://github.com/adamfratino)! - Add neutral color variant and shared PaletteColor system across indicator components. Remove badge inverted variant. Add Kbd active state with hotkey detection. Boost badge/status oklch color saturation. Restyle tabs and toggle-group with filled pill indicator, ghost prop, and remove tabs align prop. Fix input/select specificity conflict.

- Updated dependencies [[`2981db4`](https://github.com/uiid-systems/design-system/commit/2981db4f96237196766636e482920eb1ac4ec709), [`6e1874a`](https://github.com/uiid-systems/design-system/commit/6e1874a7fcfb20755f418b2c5ea3df07c31dac0b)]:
  - @uiid/forms@0.0.16
  - @uiid/buttons@0.0.16
  - @uiid/cards@0.0.16
  - @uiid/layout@0.0.16
  - @uiid/typography@0.0.16
  - @uiid/utils@0.0.16

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @uiid/buttons@0.0.15
  - @uiid/cards@0.0.15
  - @uiid/forms@0.0.15
  - @uiid/layout@0.0.15
  - @uiid/typography@0.0.15
  - @uiid/utils@0.0.15

## 0.0.14

### Patch Changes

- [#167](https://github.com/uiid-systems/design-system/pull/167) [`0b88a10`](https://github.com/uiid-systems/design-system/commit/0b88a10f830003bb07f7f72faf1698951fe0c2a4) Thanks [@adamfratino](https://github.com/adamfratino)! - Add color prop to Status component, sharing Badge's oklch color system

- Updated dependencies []:
  - @uiid/buttons@0.0.14
  - @uiid/cards@0.0.14
  - @uiid/forms@0.0.14
  - @uiid/layout@0.0.14
  - @uiid/typography@0.0.14
  - @uiid/utils@0.0.14

## 0.0.13

### Patch Changes

- [#162](https://github.com/uiid-systems/design-system/pull/162) [`8a1be59`](https://github.com/uiid-systems/design-system/commit/8a1be592a3aec2f8add47df394fee79a2b3feff0) Thanks [@adamfratino](https://github.com/adamfratino)! - badge refactor

- Updated dependencies [[`8a1be59`](https://github.com/uiid-systems/design-system/commit/8a1be592a3aec2f8add47df394fee79a2b3feff0)]:
  - @uiid/forms@0.0.13
  - @uiid/buttons@0.0.13
  - @uiid/cards@0.0.13
  - @uiid/layout@0.0.13
  - @uiid/typography@0.0.13
  - @uiid/utils@0.0.13

## 0.0.12

### Patch Changes

- [#150](https://github.com/uiid-systems/design-system/pull/150) [`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4) Thanks [@adamfratino](https://github.com/adamfratino)! - Remove tone system (positive/critical/warning/info) from all components and tokens. Form validation errors now use shade-based styling.

- Updated dependencies [[`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4)]:
  - @uiid/buttons@0.0.12
  - @uiid/cards@0.0.12
  - @uiid/typography@0.0.12
  - @uiid/forms@0.0.12
  - @uiid/layout@0.0.12
  - @uiid/utils@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies [[`e2c1394`](https://github.com/uiid-systems/design-system/commit/e2c13948302371959e2b006de776aeab6c8a3c81)]:
  - @uiid/forms@0.0.11
  - @uiid/buttons@0.0.11
  - @uiid/cards@0.0.11
  - @uiid/layout@0.0.11
  - @uiid/typography@0.0.11
  - @uiid/utils@0.0.11

## 0.0.10

### Patch Changes

- [#141](https://github.com/uiid-systems/design-system/pull/141) [`9771afa`](https://github.com/uiid-systems/design-system/commit/9771afa21e08d34f7ff1cdaa59a8c5bdf8c0d990) Thanks [@adamfratino](https://github.com/adamfratino)! - Add optional `description` field to `CategoryMeta` with descriptions for all 9 component categories

- [#144](https://github.com/uiid-systems/design-system/pull/144) [`c50a499`](https://github.com/uiid-systems/design-system/commit/c50a4994365a9e42aed888759ac0b6e7764a7988) Thanks [@adamfratino](https://github.com/adamfratino)! - Add optional `description` field to `PreviewConfig` type

- Updated dependencies [[`541df17`](https://github.com/uiid-systems/design-system/commit/541df17c59ab21bd6efd7232225c6420599b1015), [`bf38c58`](https://github.com/uiid-systems/design-system/commit/bf38c58367bfe4c02b7ebc55362d735ac855ff3b)]:
  - @uiid/forms@0.0.10
  - @uiid/buttons@0.0.10
  - @uiid/cards@0.0.10
  - @uiid/layout@0.0.10
  - @uiid/typography@0.0.10
  - @uiid/utils@0.0.10

## 0.0.8

### Patch Changes

- [#97](https://github.com/uiid-systems/design-system/pull/97) [`a411bf3`](https://github.com/uiid-systems/design-system/commit/a411bf3e887a3d8a9722824c3ea2e5096ff08142) Thanks [@adamfratino](https://github.com/adamfratino)! - refactor(ui): refactor Button API for Figma parity (#97)

- [#95](https://github.com/uiid-systems/design-system/pull/95) [`3989ce1`](https://github.com/uiid-systems/design-system/commit/3989ce127ab06f41ca006dae2681f1c3271fc7a1) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: establish code review workflow and PR review guide (#95)

- [#98](https://github.com/uiid-systems/design-system/pull/98) [`d931595`](https://github.com/uiid-systems/design-system/commit/d9315954b8ef775f8282723079e35b753473d195) Thanks [@adamfratino](https://github.com/adamfratino)! - ci: fix workflows not running on Dependabot PRs (#98)

- [#94](https://github.com/uiid-systems/design-system/pull/94) [`833327c`](https://github.com/uiid-systems/design-system/commit/833327c5056a78b6069e7497966139c4e108982e) Thanks [@adamfratino](https://github.com/adamfratino)! - refactor: simplify versioning and changelog pipeline (#94)

- [#102](https://github.com/uiid-systems/design-system/pull/102) [`4e329f6`](https://github.com/uiid-systems/design-system/commit/4e329f6245daa5f9cdeae18c71be8b9b57c06d9d) Thanks [@adamfratino](https://github.com/adamfratino)! - add optional figma.nodeId field to ComponentEntry type

- [#93](https://github.com/uiid-systems/design-system/pull/93) [`4c3ed11`](https://github.com/uiid-systems/design-system/commit/4c3ed11df32fd06d9513bea1b94797327fbafc0f) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: rename playground to blocks, rewrite README, add vision doc (#93)

  ## Summary

- [#105](https://github.com/uiid-systems/design-system/pull/105) [`089317e`](https://github.com/uiid-systems/design-system/commit/089317e625ec02e6d06472d3e9445b30939d2412) Thanks [@adamfratino](https://github.com/adamfratino)! - add figma nodeid

- [#107](https://github.com/uiid-systems/design-system/pull/107) [`160fe8a`](https://github.com/uiid-systems/design-system/commit/160fe8a27f84bc3035d9b2e85182004491784b88) Thanks [@adamfratino](https://github.com/adamfratino)! - adding mcp package

- Updated dependencies [[`a411bf3`](https://github.com/uiid-systems/design-system/commit/a411bf3e887a3d8a9722824c3ea2e5096ff08142), [`85038b4`](https://github.com/uiid-systems/design-system/commit/85038b4dc5f10092e508d5a5e3ea39ff3d668cbd), [`8678fa2`](https://github.com/uiid-systems/design-system/commit/8678fa2b558299e9eff3885aab9b5345ccc9d83b), [`3989ce1`](https://github.com/uiid-systems/design-system/commit/3989ce127ab06f41ca006dae2681f1c3271fc7a1), [`d931595`](https://github.com/uiid-systems/design-system/commit/d9315954b8ef775f8282723079e35b753473d195), [`63117da`](https://github.com/uiid-systems/design-system/commit/63117daf62005c6a194d9adc6b82dc89259e034c), [`833327c`](https://github.com/uiid-systems/design-system/commit/833327c5056a78b6069e7497966139c4e108982e), [`4c3ed11`](https://github.com/uiid-systems/design-system/commit/4c3ed11df32fd06d9513bea1b94797327fbafc0f), [`160fe8a`](https://github.com/uiid-systems/design-system/commit/160fe8a27f84bc3035d9b2e85182004491784b88)]:
  - @uiid/buttons@0.0.8
  - @uiid/forms@0.0.8
  - @uiid/cards@0.0.8
  - @uiid/layout@0.0.8
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
- feat: add sizing props (#69)
- docs: update docs (#68)
- feat: add collapsible to registry (#70)
- feat: add icons to playground (#72)
- refactor: cleanup list, docs, text (#73)
- feat: block registry (#66)
- feat: add more components to registry, separator children, other stuff (#78)
- chore(deps): bump the all-dependencies group across 1 directory with 25 updates (#76)
- refactor: playground enhancements (#82)
- refactor: tokens (#75)
- refactor: playground routing (#84)
- fix: json-render migration (#81)

## 0.0.4

### Patch Changes

- refactor: more playground tinkering (#64)
- refactor: cleanup previews (#52)
- refactor: more mdx docs (#60)
- fix: preview link to playground (#54)

## 0.0.3

### Patch Changes

- refactor: cleanup registry schemas (#39)
- test: add registry tests (#42)
- feat: add mdx support to docs, test on button (#37)
- refactor: more registry cleanup (#43)
- chore(deps-dev): bump vite from 7.1.2 to 7.1.11 (#47)
- refactor: registry component taxonomy (#41)
- chore(deps): bump next from 16.1.3 to 16.1.5 (#48)
- feat: docs (#29)
- refactor: automate docs (#40)
- refactor: registry as source of truth (#34)
- feat: link component docs to builder (#35)

## 0.0.2

### Patch Changes

- refactor: swap accent and muted colors (#25)
- fix: changelogs (#20)
- feat: add overlays to json-render, clean up
- feat: create `registry` package for component generation, add `json-render` package
