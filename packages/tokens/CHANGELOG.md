# @uiid/tokens

## 0.0.11

### Patch Changes

- [#151](https://github.com/uiid-systems/design-system/pull/151) [`e2c1394`](https://github.com/uiid-systems/design-system/commit/e2c13948302371959e2b006de776aeab6c8a3c81) Thanks [@adamfratino](https://github.com/adamfratino)! - Unify form variant styles: add default font-size token, wire switch to tokens, scale checkbox icons per size, add textarea padding-inline, add number-field size prop, and add invalid state to checkbox and radio.

## 0.0.10

### Patch Changes

- [#127](https://github.com/uiid-systems/design-system/pull/127) [`0af03b7`](https://github.com/uiid-systems/design-system/commit/0af03b75ae17444678846a7a8602200798312b51) Thanks [@adamfratino](https://github.com/adamfratino)! - Refactor List `variant` prop to boolean `line` prop, add `description` to ListItemGroupProps, add `icon-size` token, and remove duplicate stylesheet

- [#120](https://github.com/uiid-systems/design-system/pull/120) [`bf38c58`](https://github.com/uiid-systems/design-system/commit/bf38c58367bfe4c02b7ebc55362d735ac855ff3b) Thanks [@adamfratino](https://github.com/adamfratino)! - Simplify CSS layer system: collapse token sub-layers into flat `uiid.tokens`, remove unused `uiid.utilities` layer, and add consistent `cssLayer` wrapping to all component packages

- [#131](https://github.com/uiid-systems/design-system/pull/131) [`e02fb0d`](https://github.com/uiid-systems/design-system/commit/e02fb0ddfd9f07e5f1daba78dfea8dedabe139ef) Thanks [@adamfratino](https://github.com/adamfratino)! - Add WCAG AA contrast validation to theme generation pipeline and resolve theme variant tokens to static light-dark() values instead of runtime color-mix()

- [#122](https://github.com/uiid-systems/design-system/pull/122) [`16449d9`](https://github.com/uiid-systems/design-system/commit/16449d922a0664bee47673e2a802af63cfe794da) Thanks [@adamfratino](https://github.com/adamfratino)! - Replace raw hex in theme.secondary with color primitive alias

- [#123](https://github.com/uiid-systems/design-system/pull/123) [`6b81080`](https://github.com/uiid-systems/design-system/commit/6b81080780b4a173873a822bf346404e0381aa43) Thanks [@adamfratino](https://github.com/adamfratino)! - Route tone tokens through theme tier for consumer customization

- [#126](https://github.com/uiid-systems/design-system/pull/126) [`b05f3d3`](https://github.com/uiid-systems/design-system/commit/b05f3d334b12aed413ff49611c2c786c7fb0f994) Thanks [@adamfratino](https://github.com/adamfratino)! - Add user theme input schema (Zod) and build-time theme CSS generation pipeline

- Updated dependencies [[`868b793`](https://github.com/uiid-systems/design-system/commit/868b79369eef51c492efee857946595175504e91), [`f1fb926`](https://github.com/uiid-systems/design-system/commit/f1fb926d40d5beead17d520f58a4d680e2f094f1)]:
  - @uiid/themes@0.0.2

## 0.0.8

### Patch Changes

- [#97](https://github.com/uiid-systems/design-system/pull/97) [`a411bf3`](https://github.com/uiid-systems/design-system/commit/a411bf3e887a3d8a9722824c3ea2e5096ff08142) Thanks [@adamfratino](https://github.com/adamfratino)! - refactor(ui): refactor Button API for Figma parity (#97)

- [#99](https://github.com/uiid-systems/design-system/pull/99) [`85038b4`](https://github.com/uiid-systems/design-system/commit/85038b4dc5f10092e508d5a5e3ea39ff3d668cbd) Thanks [@adamfratino](https://github.com/adamfratino)! - fix: button props (#99)

- [#95](https://github.com/uiid-systems/design-system/pull/95) [`3989ce1`](https://github.com/uiid-systems/design-system/commit/3989ce127ab06f41ca006dae2681f1c3271fc7a1) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: establish code review workflow and PR review guide (#95)

- [#98](https://github.com/uiid-systems/design-system/pull/98) [`d931595`](https://github.com/uiid-systems/design-system/commit/d9315954b8ef775f8282723079e35b753473d195) Thanks [@adamfratino](https://github.com/adamfratino)! - ci: fix workflows not running on Dependabot PRs (#98)

- [#94](https://github.com/uiid-systems/design-system/pull/94) [`833327c`](https://github.com/uiid-systems/design-system/commit/833327c5056a78b6069e7497966139c4e108982e) Thanks [@adamfratino](https://github.com/adamfratino)! - refactor: simplify versioning and changelog pipeline (#94)

- [#93](https://github.com/uiid-systems/design-system/pull/93) [`4c3ed11`](https://github.com/uiid-systems/design-system/commit/4c3ed11df32fd06d9513bea1b94797327fbafc0f) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: rename playground to blocks, rewrite README, add vision doc (#93)

  ## Summary

- [#100](https://github.com/uiid-systems/design-system/pull/100) [`33ba183`](https://github.com/uiid-systems/design-system/commit/33ba1833b162fee82c0dee10c4893e58baef8b7c) Thanks [@adamfratino](https://github.com/adamfratino)! - clean up tokens

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
- refactor: cleanup list, docs, text (#73)
- feat: block registry (#66)
- feat: add more components to registry, separator children, other stuff (#78)
- chore(deps): bump the all-dependencies group across 1 directory with 25 updates (#76)
- refactor: playground enhancements (#82)
- refactor: tokens (#75)
- refactor: playground routing (#84)
- fix: json-render migration (#81)
- feat: add accordion (#71)

## 0.0.4

### Patch Changes

- refactor: more playground tinkering (#64)
- refactor: cleanup previews (#52)
- fix: preview link to playground (#54)

## 0.0.3

### Patch Changes

- feat: input-tooltip (#33)
- feat: add mdx support to docs, test on button (#37)
- refactor: cleanup tokens (#45)
- chore(deps): bump next from 16.1.3 to 16.1.5 (#48)
- refactor: tokens (#50)
- feat: link component docs to builder (#35)

## 0.0.2

### Patch Changes

- refactor: swap accent and muted colors (#25)
- fix: changelogs (#20)
- feat: add code editor component (#23)
- feat: json render page (#26)
- feat: add json-render chat (#27)
- feat: add `code` package, shiki (#22)

## 0.0.1

### Patch Changes

- chore: remove changelog story
- fix: react hook errors
- feat: add blocks package, newsletter block
- fix: release workflows
