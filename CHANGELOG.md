# Changelog

## [0.2.0](https://github.com/uiid-systems/design-system/compare/v0.1.0...v0.2.0) (2026-08-25)


### ⚠ BREAKING CHANGES

* the @base-ui/react peer range moves from ^1.2.0 to ^1.7.0. Consumers on 1.2.x-1.6.x must upgrade. Accordion triggers are no longer a roving focus group — arrow keys no longer move focus between them, per current APG guidance.
* @base-ui/react moves from dependencies to peerDependencies on @uiid/buttons, forms, indicators, interactive, layout, lists, overlays, and tables. Consumers must install @base-ui/react themselves. This is deliberate — it is what guarantees a single deduplicated instance.
* remove @uiid/calendars and RichTextEditor, fix the Storybook build ([#300](https://github.com/uiid-systems/design-system/issues/300))
* **ui:** remove Alert from @uiid/indicators ([#293](https://github.com/uiid-systems/design-system/issues/293))
* **ui:** Sidebar, SidebarProvider, useSidebar, and all Sidebar subcomponents are no longer exported from @uiid/navigation or @uiid/design-system.
* **ui:** serve icons per-module and add a @uiid/design-system/icons facade ([#288](https://github.com/uiid-systems/design-system/issues/288))

### Features

* remove @uiid/calendars and RichTextEditor, fix the Storybook build ([#300](https://github.com/uiid-systems/design-system/issues/300)) ([7bcf898](https://github.com/uiid-systems/design-system/commit/7bcf898b786d07f06dc6019846c93e618f0707a3))
* **ui:** default Card to the neutral palette and break the buttons/cards cycle ([#294](https://github.com/uiid-systems/design-system/issues/294)) ([5eea9fa](https://github.com/uiid-systems/design-system/commit/5eea9fa10e44d6caf99ee8c4445540b750746b70))
* **ui:** remove Alert from @uiid/indicators ([#293](https://github.com/uiid-systems/design-system/issues/293)) ([ef280cc](https://github.com/uiid-systems/design-system/commit/ef280ccb93af0ec8143c2539ed25d623a1ef7259))
* **ui:** remove Sidebar from @uiid/navigation ([#291](https://github.com/uiid-systems/design-system/issues/291)) ([a56c8ee](https://github.com/uiid-systems/design-system/commit/a56c8eea0d0ce801b5322a46c7fb3b8abeb038e4))
* **ui:** serve icons per-module and add a @uiid/design-system/icons facade ([#288](https://github.com/uiid-systems/design-system/issues/288)) ([e609ed9](https://github.com/uiid-systems/design-system/commit/e609ed90f3682a69f72bef6366d0f31864cb2458))


### Bug Fixes

* color primitive story ([ee3954f](https://github.com/uiid-systems/design-system/commit/ee3954f33cbe94d805fe9d5651cb4713a5d172d3))
* externalize @base-ui/react so packages share one instance ([#305](https://github.com/uiid-systems/design-system/issues/305)) ([512affd](https://github.com/uiid-systems/design-system/commit/512affd04f2d88159c663894cd5426ff443ccaef)), closes [#304](https://github.com/uiid-systems/design-system/issues/304)
* **repo:** preserve `+` when sanitizing rollup module ids ([#301](https://github.com/uiid-systems/design-system/issues/301)) ([87ebcb6](https://github.com/uiid-systems/design-system/commit/87ebcb62e10bdec67391f77c515b8284115fa605)), closes [#289](https://github.com/uiid-systems/design-system/issues/289)
* **storybook:** read typography tokens at their real DTCG path ([#311](https://github.com/uiid-systems/design-system/issues/311)) ([435d91f](https://github.com/uiid-systems/design-system/commit/435d91f41b0cd2f89c14174556aef80568e5bc79))
* **tokens:** order compositions below consumers so components can specialize ([#287](https://github.com/uiid-systems/design-system/issues/287)) ([88cc3ef](https://github.com/uiid-systems/design-system/commit/88cc3ef77f6671ef9598c30c25dab6a3d3bc29b9))
* **ui:** externalize [@dnd-kit](https://github.com/dnd-kit) and react-resizable-panels from interactive ([#308](https://github.com/uiid-systems/design-system/issues/308)) ([c6269ec](https://github.com/uiid-systems/design-system/commit/c6269ec58196ea36588468db19cee244eda460e1))
* upgrade @base-ui/react to 1.7.0 ([#307](https://github.com/uiid-systems/design-system/issues/307)) ([0c5af94](https://github.com/uiid-systems/design-system/commit/0c5af94e6753a2cee45b710e8083f240b349d1f4)), closes [#303](https://github.com/uiid-systems/design-system/issues/303)

## [0.1.0](https://github.com/uiid-systems/design-system/compare/v0.0.36...v0.1.0) (2026-08-04)

### ⚠ BREAKING CHANGES

- @uiid/registry and @uiid/mcp are no longer published.
- **ui:** `Modal` is now `Dialog` and `Sheet` is now `Drawer`. Sheet's `side` prop is replaced by Drawer's `swipeDirection`, which takes up/down/left/right instead of top/right/bottom/left and defaults to `down`.

### Features

- **ui:** add palette color prop to Button; remove inverted variant ([#275](https://github.com/uiid-systems/design-system/issues/275)) ([7cef6a1](https://github.com/uiid-systems/design-system/commit/7cef6a1f2e4db8dff747ed44510c70572426fa48))
- **ui:** align overlays with Base UI — remove vaul Drawer, Modal→Dialog, Sheet→Drawer ([#277](https://github.com/uiid-systems/design-system/issues/277)) ([54aba02](https://github.com/uiid-systems/design-system/commit/54aba02ee365f259ffe2b8076579a2788916ee20))

### Bug Fixes

- **overlays:** restore Dialog centering and animation, wire Popover a11y ([#282](https://github.com/uiid-systems/design-system/issues/282)) ([5f72fe3](https://github.com/uiid-systems/design-system/commit/5f72fe32ae50a2ded21587a2e4c2cd213166629c))
- **repo:** skip playwright browser install on vercel builds ([#281](https://github.com/uiid-systems/design-system/issues/281)) ([3bddc16](https://github.com/uiid-systems/design-system/commit/3bddc16bfedac3326f5918d4a9e4790b9bf36772))

### Miscellaneous Chores

- remove @uiid/registry, @uiid/mcp, and @uiid/blocks ([#283](https://github.com/uiid-systems/design-system/issues/283)) ([01c2ae3](https://github.com/uiid-systems/design-system/commit/01c2ae3d70fd7f8a888b736af0f406e0fb32d2a9))

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
