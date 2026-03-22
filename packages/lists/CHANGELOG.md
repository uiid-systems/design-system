# @uiid/lists

## 0.0.12

### Patch Changes

- [#150](https://github.com/uiid-systems/design-system/pull/150) [`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4) Thanks [@adamfratino](https://github.com/adamfratino)! - Remove tone system (positive/critical/warning/info) from all components and tokens. Form validation errors now use shade-based styling.

- Updated dependencies [[`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4), [`3a3a4df`](https://github.com/uiid-systems/design-system/commit/3a3a4dffde260e22e7886f74461fcfdb143614c1)]:
  - @uiid/tokens@0.0.12
  - @uiid/typography@0.0.12
  - @uiid/layout@0.0.12
  - @uiid/icons@0.0.12
  - @uiid/utils@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies [[`e2c1394`](https://github.com/uiid-systems/design-system/commit/e2c13948302371959e2b006de776aeab6c8a3c81)]:
  - @uiid/tokens@0.0.11
  - @uiid/layout@0.0.11
  - @uiid/typography@0.0.11
  - @uiid/icons@0.0.11
  - @uiid/utils@0.0.11

## 0.0.10

### Patch Changes

- [#130](https://github.com/uiid-systems/design-system/pull/130) [`b81e7eb`](https://github.com/uiid-systems/design-system/commit/b81e7ebed447d6e7582ac2f633b5a520714745f9) Thanks [@adamfratino](https://github.com/adamfratino)! - Add optional `id` prop to `ListItemGroupProps` for stable React keys, fixing duplicate key warnings in tree navigator

- [#115](https://github.com/uiid-systems/design-system/pull/115) [`cbc0598`](https://github.com/uiid-systems/design-system/commit/cbc0598b57d1bc2ba14fd1048d925b0af24cee78) Thanks [@adamfratino](https://github.com/adamfratino)! - Support recursive nesting in ListItemGroup

- [#127](https://github.com/uiid-systems/design-system/pull/127) [`0af03b7`](https://github.com/uiid-systems/design-system/commit/0af03b75ae17444678846a7a8602200798312b51) Thanks [@adamfratino](https://github.com/adamfratino)! - Refactor List `variant` prop to boolean `line` prop, add `description` to ListItemGroupProps, add `icon-size` token, and remove duplicate stylesheet

- [#120](https://github.com/uiid-systems/design-system/pull/120) [`bf38c58`](https://github.com/uiid-systems/design-system/commit/bf38c58367bfe4c02b7ebc55362d735ac855ff3b) Thanks [@adamfratino](https://github.com/adamfratino)! - Simplify CSS layer system: collapse token sub-layers into flat `uiid.tokens`, remove unused `uiid.utilities` layer, and add consistent `cssLayer` wrapping to all component packages

- Updated dependencies [[`0af03b7`](https://github.com/uiid-systems/design-system/commit/0af03b75ae17444678846a7a8602200798312b51), [`bf38c58`](https://github.com/uiid-systems/design-system/commit/bf38c58367bfe4c02b7ebc55362d735ac855ff3b), [`e02fb0d`](https://github.com/uiid-systems/design-system/commit/e02fb0ddfd9f07e5f1daba78dfea8dedabe139ef), [`16449d9`](https://github.com/uiid-systems/design-system/commit/16449d922a0664bee47673e2a802af63cfe794da), [`6b81080`](https://github.com/uiid-systems/design-system/commit/6b81080780b4a173873a822bf346404e0381aa43), [`b05f3d3`](https://github.com/uiid-systems/design-system/commit/b05f3d334b12aed413ff49611c2c786c7fb0f994)]:
  - @uiid/tokens@0.0.10
  - @uiid/layout@0.0.10
  - @uiid/typography@0.0.10
  - @uiid/icons@0.0.10
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
  - @uiid/icons@0.0.8
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
- docs: update docs (#68)
- refactor: redesign playground (#80)
- feat: add icons to playground (#72)
- refactor: cleanup list, docs, text (#73)
- feat: block registry (#66)
- feat: add more components to registry, separator children, other stuff (#78)
- chore(deps): bump the all-dependencies group across 1 directory with 25 updates (#76)
- refactor: playground enhancements (#82)
- refactor: playground routing (#84)
- fix: json-render migration (#81)

## 0.0.4

### Patch Changes

- fix: preview link to playground (#54)

## 0.0.3

### Patch Changes

- feat: add mdx support to docs, test on button (#37)
- refactor: cleanup tokens (#45)
- chore(deps-dev): bump vite from 7.1.2 to 7.1.11 (#47)
- chore(deps): bump next from 16.1.3 to 16.1.5 (#48)
- refactor: tokens (#50)

## 0.0.2

### Patch Changes

- refactor: swap accent and muted colors (#25)
- fix: changelogs (#20)

## 0.0.1

### Patch Changes

- chore: remove changelog story
