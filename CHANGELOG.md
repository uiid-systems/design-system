# Changelog

## [0.4.0](https://github.com/uiid-systems/design-system/compare/v0.3.0...v0.4.0) (2026-09-06)


### ⚠ BREAKING CHANGES

* **ui:** `ToggleGroup` and `Tabs` no longer accept `size="sm" | "md" | "lg"`. Use `xsmall | small | medium | large`. Shipped as a straight break rather than an alias period — pre-1.0, no consumer outside the repo passes either prop, and the codebase has no deprecation precedent to follow.

### Features

* **ui:** add color prop to Input and Textarea via the shared field surface ([#369](https://github.com/uiid-systems/design-system/issues/369)) ([69d7d8a](https://github.com/uiid-systems/design-system/commit/69d7d8a9dfab04fbf581b806f01bbeb033fcedee))
* **ui:** align toggle group and tabs size vocabulary with the system tiers ([#378](https://github.com/uiid-systems/design-system/issues/378)) ([5279f43](https://github.com/uiid-systems/design-system/commit/5279f431a10f65e4d2c9bba10ea6bb27d8fbfb97))


### Bug Fixes

* **storybook:** move the ignore step into a script to fit Vercel's limit ([#377](https://github.com/uiid-systems/design-system/issues/377)) ([caf4c98](https://github.com/uiid-systems/design-system/commit/caf4c9802b7c2c8a560dd1a1d865f22beb846d56))
* **storybook:** unbreak the Vercel Storybook deploy ([#376](https://github.com/uiid-systems/design-system/issues/376)) ([cd36068](https://github.com/uiid-systems/design-system/commit/cd3606847991d3725e47436e8a480762bf7c5857))
* **ui:** scale the radio indicator dot with the size tier ([#366](https://github.com/uiid-systems/design-system/issues/366)) ([f066393](https://github.com/uiid-systems/design-system/commit/f0663932367bde4178c4a6c141fffbea4eab3f32))

## [0.3.0](https://github.com/uiid-systems/design-system/compare/v0.2.0...v0.3.0) (2026-08-31)


### ⚠ BREAKING CHANGES

* **ui:** migrate ghost boolean to the variant axis ([#363](https://github.com/uiid-systems/design-system/issues/363))
* **ui:** `RadioGroup` no longer preselects the first item. Pass `defaultValue` to keep the previous behaviour.
* **ui:** `ComboboxActionButtons` is removed — compose `ComboboxClear` and `ComboboxTrigger` instead. NumberField's input now carries `data-slot="number-field-input"` rather than the generic `data-slot="input"`, matching `combobox-input` and `autocomplete-input`.
* **ui:** `@uiid/forms` no longer exports from `./input/input-control` directly; `InputControl` now ships from `./input/subcomponents` alongside the newly exported `InputWrapper`. The barrel import path is unchanged.
* **ui:** the `SelectMultiple` component and `SelectMultipleProps` / `SelectMultipleRootProps` / `SelectMultipleTriggerProps` types are removed. Use `<Select multiple />` and `SelectProps<string, true>`.
* **ui:** `SelectIndicator` is now `SelectIcon`, `SelectIndicatorProps` is now `SelectIconProps`, and Select's `IndicatorProps` prop is now `IconProps`.
* **ui:** CHECKBOX_DEFAULT_SIZE and SELECT_DEFAULT_SIZE are no longer exported from @uiid/forms.

### Features

* **tokens:** add component token files for the uncovered forms components ([#359](https://github.com/uiid-systems/design-system/issues/359)) ([da9298e](https://github.com/uiid-systems/design-system/commit/da9298e22c37433b7c6a02cb5fa89a185e4aa06c))
* **ui:** add xsmall tier and size props to sizeless form controls ([#361](https://github.com/uiid-systems/design-system/issues/361)) ([66cf41d](https://github.com/uiid-systems/design-system/commit/66cf41d52ae0d2bdc905477a0197fff5a9f2f86e))
* **ui:** collapse SelectMultiple into Select via the multiple prop ([#336](https://github.com/uiid-systems/design-system/issues/336)) ([0a37509](https://github.com/uiid-systems/design-system/commit/0a375090089f0abb1bfab072c6862a0f3cf9f012))
* **ui:** export select and radio subcomponents, stop exporting forms constants ([#334](https://github.com/uiid-systems/design-system/issues/334)) ([e8f1e26](https://github.com/uiid-systems/design-system/commit/e8f1e26ef83422c3aec55bb2c7d91feb5c8a8aff))
* **ui:** fill Base UI part coverage for combobox, autocomplete, number-field ([#344](https://github.com/uiid-systems/design-system/issues/344)) ([8c059fa](https://github.com/uiid-systems/design-system/commit/8c059fa3da86a5fd51e62031b88d1ed9f3eb9e36))
* **ui:** give number-field, slider and radio their own cva variants ([#356](https://github.com/uiid-systems/design-system/issues/356)) ([3e97e03](https://github.com/uiid-systems/design-system/commit/3e97e037916603fcbca5cc7d0b3590aae6d31d50))
* **ui:** wrap Field.Control, Field.Validity, and Field.Item ([#323](https://github.com/uiid-systems/design-system/issues/323)) ([d6dcbcb](https://github.com/uiid-systems/design-system/commit/d6dcbcbaf11c836ead31a0497d574be198899d16))


### Bug Fixes

* **tokens:** clear the build collisions and order CSS generation before dev ([#353](https://github.com/uiid-systems/design-system/issues/353)) ([44761a3](https://github.com/uiid-systems/design-system/commit/44761a3bc3762760729531b378d9fbf19decdaca))
* **ui:** align popup stacking and restore popup exit animations ([#321](https://github.com/uiid-systems/design-system/issues/321)) ([be10e09](https://github.com/uiid-systems/design-system/commit/be10e0900688b9b51f07f1cd96315ff2b906b41c))
* **ui:** drop hardcoded checkbox aria-label, add missing "use client" ([#320](https://github.com/uiid-systems/design-system/issues/320)) ([1bd7bec](https://github.com/uiid-systems/design-system/commit/1bd7becbffe04f662ae3d319286306c5fdb0d722))
* **ui:** forward name to Combobox and Autocomplete inputs ([#355](https://github.com/uiid-systems/design-system/issues/355)) ([b0ece16](https://github.com/uiid-systems/design-system/commit/b0ece16e41d565098aa388b3c3ae9f7469d52865))
* **ui:** let RadioGroup render unselected and forward its field props ([#349](https://github.com/uiid-systems/design-system/issues/349)) ([ccb70f5](https://github.com/uiid-systems/design-system/commit/ccb70f5a827e448b0f22fd9ed226bf36d1ba56af))
* **ui:** make required reach the control, not just the label ([#351](https://github.com/uiid-systems/design-system/issues/351)) ([fee1cfa](https://github.com/uiid-systems/design-system/commit/fee1cfa933fd216dba5abb5ffb9c60ffd945038a))
* **ui:** one invalid-state language on palette tokens across the forms package ([#328](https://github.com/uiid-systems/design-system/issues/328)) ([3225bb1](https://github.com/uiid-systems/design-system/commit/3225bb1ef94e38a3eb362d92b860c510baaf5038))
* **ui:** rebuild the checkbox, switch, and radio rows on Field.Item ([#327](https://github.com/uiid-systems/design-system/issues/327)) ([2b91d82](https://github.com/uiid-systems/design-system/commit/2b91d82ef42fb4d106d515b7de8f2d0fb806293d))
* **ui:** render a CheckboxGroup form error once, not once per box ([#362](https://github.com/uiid-systems/design-system/issues/362)) ([eaa37de](https://github.com/uiid-systems/design-system/commit/eaa37de290c46475f16f8bbd5bc0663343e53234))
* **ui:** repair CheckboxGroup item handling and add its compound API ([#348](https://github.com/uiid-systems/design-system/issues/348)) ([2a65765](https://github.com/uiid-systems/design-system/commit/2a6576593005adff220220afbbd466b2d8d93df9))
* **ui:** repair switch easing and checkbox hit area, drop dead forms CSS ([#318](https://github.com/uiid-systems/design-system/issues/318)) ([977931b](https://github.com/uiid-systems/design-system/commit/977931bdc77b39a1de9087f0dedd19cacb6ea5ae))
* **ui:** replace self-referential @uiid/forms imports in switch ([#314](https://github.com/uiid-systems/design-system/issues/314)) ([620a947](https://github.com/uiid-systems/design-system/commit/620a947cb92cb0eea89a650ec13f507314d07f9c))
* **ui:** resolve dangling forms styles references to missing CSS classes ([#322](https://github.com/uiid-systems/design-system/issues/322)) ([18f93cc](https://github.com/uiid-systems/design-system/commit/18f93cc8306f33b3f9054840b9813ae7d0946877))
* **ui:** restore the Slider value contract, support ranges, wrap Label ([#350](https://github.com/uiid-systems/design-system/issues/350)) ([91e9714](https://github.com/uiid-systems/design-system/commit/91e97143a3e6704fc1b0429824d57790065ee409))
* **ui:** route Combobox and Autocomplete props to their intended targets ([#325](https://github.com/uiid-systems/design-system/issues/325)) ([2883a53](https://github.com/uiid-systems/design-system/commit/2883a532b5518469bbd348f47254fdb7d8dbaa0e))
* **ui:** unify forms focus on :focus-visible and restore missing rings ([#315](https://github.com/uiid-systems/design-system/issues/315)) ([84367c1](https://github.com/uiid-systems/design-system/commit/84367c107dca9fe538c9539e6fcaa33cd3552244))


### Code Refactoring

* **ui:** migrate ghost boolean to the variant axis ([#363](https://github.com/uiid-systems/design-system/issues/363)) ([0679949](https://github.com/uiid-systems/design-system/commit/0679949b463330e887e1423aad44c44d2386570a))
* **ui:** promote input subcomponents and document the Input size recast ([#342](https://github.com/uiid-systems/design-system/issues/342)) ([601a622](https://github.com/uiid-systems/design-system/commit/601a622f54684f470ed68b151aa23c3c633f131c))
* **ui:** rename SelectIndicator to SelectIcon to mirror Base UI ([#335](https://github.com/uiid-systems/design-system/issues/335)) ([2b3c461](https://github.com/uiid-systems/design-system/commit/2b3c4618e17cc1d739fb503fb61d493d6c777535))

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
