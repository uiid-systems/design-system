# Changelog

## [0.1.0](https://github.com/uiid-systems/design-system/compare/v0.0.36...v0.1.0) (2026-08-04)


### ⚠ BREAKING CHANGES

* @uiid/registry and @uiid/mcp are no longer published.
* **ui:** `Modal` is now `Dialog` and `Sheet` is now `Drawer`. Sheet's `side` prop is replaced by Drawer's `swipeDirection`, which takes up/down/left/right instead of top/right/bottom/left and defaults to `down`.

### Features

* **ui:** add palette color prop to Button; remove inverted variant ([#275](https://github.com/uiid-systems/design-system/issues/275)) ([7cef6a1](https://github.com/uiid-systems/design-system/commit/7cef6a1f2e4db8dff747ed44510c70572426fa48))
* **ui:** align overlays with Base UI — remove vaul Drawer, Modal→Dialog, Sheet→Drawer ([#277](https://github.com/uiid-systems/design-system/issues/277)) ([54aba02](https://github.com/uiid-systems/design-system/commit/54aba02ee365f259ffe2b8076579a2788916ee20))


### Bug Fixes

* **overlays:** restore Dialog centering and animation, wire Popover a11y ([#282](https://github.com/uiid-systems/design-system/issues/282)) ([5f72fe3](https://github.com/uiid-systems/design-system/commit/5f72fe32ae50a2ded21587a2e4c2cd213166629c))
* **repo:** skip playwright browser install on vercel builds ([#281](https://github.com/uiid-systems/design-system/issues/281)) ([3bddc16](https://github.com/uiid-systems/design-system/commit/3bddc16bfedac3326f5918d4a9e4790b9bf36772))


### Miscellaneous Chores

* remove @uiid/registry, @uiid/mcp, and @uiid/blocks ([#283](https://github.com/uiid-systems/design-system/issues/283)) ([01c2ae3](https://github.com/uiid-systems/design-system/commit/01c2ae3d70fd7f8a888b736af0f406e0fb32d2a9))

## [0.0.36](https://github.com/uiid-systems/design-system/compare/v0.0.35...v0.0.36) (2026-07-20)

### Features

- **docs:** add changelog page sourced from root CHANGELOG ([#267](https://github.com/uiid-systems/design-system/issues/267)) ([08a380d](https://github.com/uiid-systems/design-system/commit/08a380dbc9ce92936a7c70d87502725464850941))
- **ui:** add Number component ([#271](https://github.com/uiid-systems/design-system/issues/271)) ([9020d3c](https://github.com/uiid-systems/design-system/commit/9020d3cc54c99e04326b696c916cf65529379df3))
- **ui:** add Reveal component ([#270](https://github.com/uiid-systems/design-system/issues/270)) ([e6550b4](https://github.com/uiid-systems/design-system/commit/e6550b416b6469f7ab9bced6bd5f930af0843f39))
- **ui:** add sticky header and footer options to Table ([#272](https://github.com/uiid-systems/design-system/issues/272)) ([49c4ac2](https://github.com/uiid-systems/design-system/commit/49c4ac2f48d74b7f5e4bb753cf90f02d7a6566f8))

### Bug Fixes

- **repo:** externalize number-flow in typography build ([#273](https://github.com/uiid-systems/design-system/issues/273)) ([e568795](https://github.com/uiid-systems/design-system/commit/e5687952f3f96665fa2c9c89f61f25364cbb9206))

## [0.0.35](https://github.com/uiid-systems/design-system/compare/v0.0.34...v0.0.35) (2026-07-16)

### Features

- **docs:** rebuild docs on mdx with storybook-parallel sources ([#262](https://github.com/uiid-systems/design-system/issues/262)) ([4a7e1c7](https://github.com/uiid-systems/design-system/commit/4a7e1c7c3e5f9f938aaa8a9b11fc89141f8181d1))

### Bug Fixes

- clean up conditional-render example ([088f5aa](https://github.com/uiid-systems/design-system/commit/088f5aacdeb63be3d88c60f36adba3b13f6f0597))
