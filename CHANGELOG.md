# Changelog

## [0.10.0](https://github.com/uiid-systems/design-system/compare/v0.9.0...v0.10.0) (2026-11-28)


### ⚠ BREAKING CHANGES

* **ui:** a Menu with RootProps.modal false no longer dims the page.
* **ui:** apply CodeBlock's header rule, slot types and frame to CodeEditor ([#734](https://github.com/uiid-systems/design-system/issues/734))
* **ui:** render the Menu popup and rows on Card and ListItem ([#731](https://github.com/uiid-systems/design-system/issues/731))
* **ui:** make the CodeBlock wrap and fullscreen buttons opt-in ([#714](https://github.com/uiid-systems/design-system/issues/714))
* **ui:** omit owned keys from the forms, card, overlay, navigation and code slot props ([#724](https://github.com/uiid-systems/design-system/issues/724))
* **ui:** omit the keys Menu, Avatar and Progress own from their slot props ([#721](https://github.com/uiid-systems/design-system/issues/721))
* **ui:** fullwidth is gone from Button, ToggleButton and every forms control. Pass w="full" to fill, or w={null} to release a default fill.
* **ui:** SizingProps w and h now include null; code reading them must handle it.
* **ui:** Card FooterProps.hideSeparator, Resizable direction, Tabs TabsItemData.render, the TabProps type and useHighlighter are removed. Use separator, orientation, content, TabsItemData, and getHighlighter() or loadLanguage(). Resizable's root attribute is now data-orientation.
* **ui:** Table no longer writes data-striped, data-bordered or data-hover.
* **ui:** apply the export and slot rules to tables and ai ([#699](https://github.com/uiid-systems/design-system/issues/699))
* **ui:** export only the forms components, parts, masks and their types ([#697](https://github.com/uiid-systems/design-system/issues/697))
* **ui:** omit the keys the forms controls own from their slot props ([#696](https://github.com/uiid-systems/design-system/issues/696))
* **ui:** give the forms controls one FieldSlotProps type ([#694](https://github.com/uiid-systems/design-system/issues/694))
* **ui:** export the middle layer's parts and omit owned keys from its slot props ([#692](https://github.com/uiid-systems/design-system/issues/692))
* **ui:** apply the export and slot rules to layout, typography, buttons, interactive and markdown ([#691](https://github.com/uiid-systems/design-system/issues/691))
* **ui:** a function className on these parts is a type error; style state through data-*
* **ui:** apply the export rule to utils, tokens and icons ([#687](https://github.com/uiid-systems/design-system/issues/687))
* **ui:** MaskInput takes an imported mask (mask={phoneMask}), not a string key. The useMask hook, *Pattern objects and engine props are removed.
* **ui:** stop re-exporting @uiid/utils from the design-system root ([#677](https://github.com/uiid-systems/design-system/issues/677))
* **ui:** require @base-ui/react 1.9 ([#674](https://github.com/uiid-systems/design-system/issues/674))
* **ui:** Timeline and its parts are no longer exported from @uiid/indicators.
* **ui:** remove unused public API ([#645](https://github.com/uiid-systems/design-system/issues/645))

### Features

* **docs:** add the nav config types and helpers ([#772](https://github.com/uiid-systems/design-system/issues/772)) ([f8b2d92](https://github.com/uiid-systems/design-system/commit/f8b2d9208653d637b4843f4136eec11e03f9bf5e))
* **docs:** build the docs breadcrumb trail from nav.ts ([#776](https://github.com/uiid-systems/design-system/issues/776)) ([b98e91c](https://github.com/uiid-systems/design-system/commit/b98e91c1fff9175eebafae282d63f9b24716e991))
* **docs:** fill the docs sidebar and pager from nav.ts ([#774](https://github.com/uiid-systems/design-system/issues/774)) ([ca1acd0](https://github.com/uiid-systems/design-system/commit/ca1acd06aae8fd8566c20b8d3ae3f5e1a9c815dc))
* **docs:** render docs examples through CodePreview ([#750](https://github.com/uiid-systems/design-system/issues/750)) ([ba66712](https://github.com/uiid-systems/design-system/commit/ba6671250616795fa158fc78b6c67e7e8a4fde02))
* **ui:** add a codeBlock override to Markdown ([#755](https://github.com/uiid-systems/design-system/issues/755)) ([e5aa3ff](https://github.com/uiid-systems/design-system/commit/e5aa3ff305cdb9162286bdad8df372f60cc3dcc5))
* **ui:** add a horizontal CollapsiblePanel and a collapsible docs sidebar ([#655](https://github.com/uiid-systems/design-system/issues/655)) ([dc452d2](https://github.com/uiid-systems/design-system/commit/dc452d28518ea54b6bab5f56420886c82e7da7e5))
* **ui:** add a mask prop and InputMask type to Input ([#675](https://github.com/uiid-systems/design-system/issues/675)) ([97e3bf4](https://github.com/uiid-systems/design-system/commit/97e3bf4f0d97b2c57b45b67913fb74dc7a7d8b25))
* **ui:** add a separator entry to Menu items, with a MenuSeparator part ([#767](https://github.com/uiid-systems/design-system/issues/767)) ([2d5b017](https://github.com/uiid-systems/design-system/commit/2d5b017648ac36ed6748e571f88badcb9bf9a373))
* **ui:** add an opt-in reset button and an error boundary to CodePreview ([#745](https://github.com/uiid-systems/design-system/issues/745)) ([e7be002](https://github.com/uiid-systems/design-system/commit/e7be002cf004d6958946e377b6fd09511a84ead4))
* **ui:** add an unstyled option to DialogPopup ([#723](https://github.com/uiid-systems/design-system/issues/723)) ([441d01f](https://github.com/uiid-systems/design-system/commit/441d01f3f53127178b610d1dc4882b96c6fab110))
* **ui:** add CodeBlock notations and hideLanguageIcon for opt-in chat code blocks ([#759](https://github.com/uiid-systems/design-system/issues/759)) ([6295a24](https://github.com/uiid-systems/design-system/commit/6295a247da60eaacbd2267a13a9948889859ac2c))
* **ui:** add CodePreview, a live example with its source collapsed beneath it ([#741](https://github.com/uiid-systems/design-system/issues/741)) ([1ef4ca3](https://github.com/uiid-systems/design-system/commit/1ef4ca33ddcd0ebb071d8c258476a23161b3da42))
* **ui:** add ContextMenu root, trigger and positioner parts ([#781](https://github.com/uiid-systems/design-system/issues/781)) ([19fba03](https://github.com/uiid-systems/design-system/commit/19fba03ce03e5e301e54a19131fe321f6960b737))
* **ui:** add controlled state and content and expand toggle slots to CodeBlock ([#727](https://github.com/uiid-systems/design-system/issues/727)) ([531bd7a](https://github.com/uiid-systems/design-system/commit/531bd7a432d6b559e03a81a3735f3876631b1e35))
* **ui:** add currencyMask, percentMask and numberMask ([#678](https://github.com/uiid-systems/design-system/issues/678)) ([3b40665](https://github.com/uiid-systems/design-system/commit/3b40665aa15422747d2852b5258628ad87b006ef))
* **ui:** add description and href to Menu items, with a MenuLinkItem part ([#761](https://github.com/uiid-systems/design-system/issues/761)) ([478a7f5](https://github.com/uiid-systems/design-system/commit/478a7f50403e7b0c21632cadce7f7a7b90418a46))
* **ui:** add Menu slots for the portal and submenu popups ([#760](https://github.com/uiid-systems/design-system/issues/760)) ([0bd3ab7](https://github.com/uiid-systems/design-system/commit/0bd3ab71a14ec20520b4b6fa8d4934f1898f2459))
* **ui:** add MenuCheckboxItem and its indicator ([#763](https://github.com/uiid-systems/design-system/issues/763)) ([6ed8176](https://github.com/uiid-systems/design-system/commit/6ed8176315f5f14a12bc9e8204a47a04369e9351))
* **ui:** add MenuGroup and MenuGroupLabel parts ([#757](https://github.com/uiid-systems/design-system/issues/757)) ([83f26c7](https://github.com/uiid-systems/design-system/commit/83f26c75841fa3d8535fe3f736fdcaace0fa0457))
* **ui:** add MenuRadioGroup and MenuRadioItem parts ([#765](https://github.com/uiid-systems/design-system/issues/765)) ([25874de](https://github.com/uiid-systems/design-system/commit/25874def54440b2c03f6914b0edcccd2ed26aae1))
* **ui:** add patternMask and rebuild the 13 fixed patterns as masks ([#681](https://github.com/uiid-systems/design-system/issues/681)) ([6b326a5](https://github.com/uiid-systems/design-system/commit/6b326a58716bbf0e2b9c20b6450cfbb305a012cf))
* **ui:** add the ContextMenu component that takes Menu's items ([#783](https://github.com/uiid-systems/design-system/issues/783)) ([d681cbf](https://github.com/uiid-systems/design-system/commit/d681cbf6fe57a66debe44f449219b8de88f50194))
* **ui:** apply CodeBlock's header rule, slot types and frame to CodeEditor ([#734](https://github.com/uiid-systems/design-system/issues/734)) ([5c00029](https://github.com/uiid-systems/design-system/commit/5c00029f35b216fecad14272fc66f68fce7fc78e))
* **ui:** apply the export and slot rules to layout, typography, buttons, interactive and markdown ([#691](https://github.com/uiid-systems/design-system/issues/691)) ([fae9d28](https://github.com/uiid-systems/design-system/commit/fae9d287dcc8ee6c2101f4fafbf5a4e7bfacdd3b))
* **ui:** apply the export and slot rules to tables and ai ([#699](https://github.com/uiid-systems/design-system/issues/699)) ([aac3614](https://github.com/uiid-systems/design-system/commit/aac3614af8bfa6cea9caaeb0d21395244d94e28a))
* **ui:** apply the export rule to utils, tokens and icons ([#687](https://github.com/uiid-systems/design-system/issues/687)) ([d1f6bd6](https://github.com/uiid-systems/design-system/commit/d1f6bd602d8658e974e2939db759f7c2604091e7))
* **ui:** export only the forms components, parts, masks and their types ([#697](https://github.com/uiid-systems/design-system/issues/697)) ([36b6796](https://github.com/uiid-systems/design-system/commit/36b6796d768a206d77ed6d69cf086eb1abe42886))
* **ui:** export the code block expand toggle as a Button part ([#718](https://github.com/uiid-systems/design-system/issues/718)) ([82c86f0](https://github.com/uiid-systems/design-system/commit/82c86f068ebf63a7c5030a3617d11dd054347f35))
* **ui:** export the middle layer's parts and omit owned keys from its slot props ([#692](https://github.com/uiid-systems/design-system/issues/692)) ([25e0404](https://github.com/uiid-systems/design-system/commit/25e04049618c7d9cd6c4fef08cb054cb587357c6))
* **ui:** finish CodePreview's look and keep its frame's width when the code opens ([#749](https://github.com/uiid-systems/design-system/issues/749)) ([1193af4](https://github.com/uiid-systems/design-system/commit/1193af46b247cddc551a807e6478e9931a46849d))
* **ui:** give the CodeBlock frame the editor background and shrink code text to 12px ([#729](https://github.com/uiid-systems/design-system/issues/729)) ([7101d70](https://github.com/uiid-systems/design-system/commit/7101d705fcbdac72d2c30a96d3ed48f4e02d47ac))
* **ui:** give the forms controls one FieldSlotProps type ([#694](https://github.com/uiid-systems/design-system/issues/694)) ([3311196](https://github.com/uiid-systems/design-system/commit/3311196600d2db317a56fe49c5e791d2dbb3478d))
* **ui:** make MaskInput a thin wrapper over Input and retire its engine ([#682](https://github.com/uiid-systems/design-system/issues/682)) ([c37fa86](https://github.com/uiid-systems/design-system/commit/c37fa868f88c4807bdaa72d25980d72b62cad319))
* **ui:** make the CodeBlock wrap and fullscreen buttons opt-in ([#714](https://github.com/uiid-systems/design-system/issues/714)) ([59a6d6a](https://github.com/uiid-systems/design-system/commit/59a6d6aa085ff5a5e7715d832d5a3911f3af75e8))
* **ui:** omit the keys the forms controls own from their slot props ([#696](https://github.com/uiid-systems/design-system/issues/696)) ([aba9fa5](https://github.com/uiid-systems/design-system/commit/aba9fa55819abcfa29dacb45526c7e6ad47d21a6))
* **ui:** render CodeBlock fullscreen through the UIID Dialog ([#726](https://github.com/uiid-systems/design-system/issues/726)) ([64d4814](https://github.com/uiid-systems/design-system/commit/64d481430af469bccc81c16017955ed02eac638c))
* **ui:** render Menu submenus at any depth ([#758](https://github.com/uiid-systems/design-system/issues/758)) ([7e70acf](https://github.com/uiid-systems/design-system/commit/7e70acf47f0c1bfe0ec5c945cdb7cb6db0b6f7bb))
* **ui:** render the CodeBlock header from its content and tighten the frame ([#722](https://github.com/uiid-systems/design-system/issues/722)) ([f4daff4](https://github.com/uiid-systems/design-system/commit/f4daff4b3e11005b7ff45f443f428aa9594c0729))
* **ui:** render the Menu popup and rows on Card and ListItem ([#731](https://github.com/uiid-systems/design-system/issues/731)) ([cd868eb](https://github.com/uiid-systems/design-system/commit/cd868ebdcc1945d5266c9f4a76251e01d15a2b23))
* **ui:** stop re-exporting @uiid/utils from the design-system root ([#677](https://github.com/uiid-systems/design-system/issues/677)) ([190ae91](https://github.com/uiid-systems/design-system/commit/190ae91b00418ff7265a4be372a36a4f7185e964))
* **ui:** style every Menu row state from tokens ([#738](https://github.com/uiid-systems/design-system/issues/738)) ([9ec6d17](https://github.com/uiid-systems/design-system/commit/9ec6d179666e46d852c68d0e1d78fb5c89b5ad7b))


### Bug Fixes

* **storybook:** load token CSS once in Storybook dev ([#661](https://github.com/uiid-systems/design-system/issues/661)) ([73eda0a](https://github.com/uiid-systems/design-system/commit/73eda0a4f4fae20e483be3f4e5f6aff22a09ba93))
* **ui:** color plain code with the code theme's default foreground ([#748](https://github.com/uiid-systems/design-system/issues/748)) ([56be953](https://github.com/uiid-systems/design-system/commit/56be953a6a998a1aa71a8037f963dbd522b2325e))
* **ui:** draw Menu's backdrop only when the menu is modal ([#756](https://github.com/uiid-systems/design-system/issues/756)) ([d4b8ec6](https://github.com/uiid-systems/design-system/commit/d4b8ec675d0695fe905b70ca4057b604ec334093))
* **ui:** give Button's tooltip the same border and shadow as Tooltip ([#773](https://github.com/uiid-systems/design-system/issues/773)) ([ba9094b](https://github.com/uiid-systems/design-system/commit/ba9094b326f75019b904b939a1230677adec491c))
* **ui:** give Menu the shared row highlight and switch popup row highlights at once ([#754](https://github.com/uiid-systems/design-system/issues/754)) ([6629da0](https://github.com/uiid-systems/design-system/commit/6629da02b696fd032c697590478dd02d61a05382))
* **ui:** harden CodeInline wrapping and markup extraction in prose ([#719](https://github.com/uiid-systems/design-system/issues/719)) ([a50bf1a](https://github.com/uiid-systems/design-system/commit/a50bf1a5f3903ffbdf726b0666e5f4c8d6f74f14))
* **ui:** hold back a streaming code block's closing fence and space code nested in lists and quotes ([#766](https://github.com/uiid-systems/design-system/issues/766)) ([29ccc4b](https://github.com/uiid-systems/design-system/commit/29ccc4b3da1dcddd47bd47c2ae30948f5448bd92))
* **ui:** keep a CodeBlock inside a Card or Collapsible to the width it has ([#742](https://github.com/uiid-systems/design-system/issues/742)) ([e10cb82](https://github.com/uiid-systems/design-system/commit/e10cb82fa5e2665fe4f9829393006428b54ab3f6))
* **ui:** keep CodeEditor's highlight layer aligned and in step with its textarea ([#743](https://github.com/uiid-systems/design-system/issues/743)) ([1665084](https://github.com/uiid-systems/design-system/commit/166508403ca2c3cba8173e7298442a2f74275c8e))
* **ui:** keep the CodeBlock fallback in place when highlighting lands ([#732](https://github.com/uiid-systems/design-system/issues/732)) ([5ed27e2](https://github.com/uiid-systems/design-system/commit/5ed27e2464d25619f3fdde2e79ba15823a0d0770))
* **ui:** leave the full keyboard on number masks that accept negatives ([#689](https://github.com/uiid-systems/design-system/issues/689)) ([41c91e1](https://github.com/uiid-systems/design-system/commit/41c91e1b3f062b5362ba36e5a66fefa54455afae))
* **ui:** make overflowing CodeBlock code keyboard scrollable and fix trailing newlines and failed highlights ([#737](https://github.com/uiid-systems/design-system/issues/737)) ([a210ced](https://github.com/uiid-systems/design-system/commit/a210cedbb419500ad86a14745e59ec64e9466768))
* **ui:** require @base-ui/react 1.9 ([#674](https://github.com/uiid-systems/design-system/issues/674)) ([2f68ce3](https://github.com/uiid-systems/design-system/commit/2f68ce304d6fccaf5846f036b826428a40e014d5))
* **ui:** return focus to the CodeBlock fullscreen toggle when nothing had focus at open ([#733](https://github.com/uiid-systems/design-system/issues/733)) ([bf58322](https://github.com/uiid-systems/design-system/commit/bf5832215d49a2af7c9cb11708f2a20de040b76d))
* **ui:** run one highlight at a time in useHighlight and skip stale values ([#720](https://github.com/uiid-systems/design-system/issues/720)) ([8ed648a](https://github.com/uiid-systems/design-system/commit/8ed648a8a169d0f6fdac7178de2ca5f0f170806d))
* **ui:** ship the root LICENSE in the @uiid/forms tarball ([#685](https://github.com/uiid-systems/design-system/issues/685)) ([ae9ce29](https://github.com/uiid-systems/design-system/commit/ae9ce29791cbb2d2324fabc7409ba048c9c9398a))
* **ui:** show every character of a streaming CodeBlock as it arrives ([#740](https://github.com/uiid-systems/design-system/issues/740)) ([4146919](https://github.com/uiid-systems/design-system/commit/4146919804c15d840a667a3e8a5f0ef62c820ec5))
* **ui:** stop treating title as the spinner's accessible name ([#660](https://github.com/uiid-systems/design-system/issues/660)) ([8f80a93](https://github.com/uiid-systems/design-system/commit/8f80a9364f901ecaaa4768da6f27f92fb8fddc0c))
* **ui:** wrap CodeBlock lines with line numbers as one line and prove long lines stay contained ([#735](https://github.com/uiid-systems/design-system/issues/735)) ([a45184c](https://github.com/uiid-systems/design-system/commit/a45184c0447f7b3b155b6c8d443bfe3c04b23c03))


### Code Refactoring

* **ui:** move Table's row style flags into tableVariants ([#703](https://github.com/uiid-systems/design-system/issues/703)) ([74a147a](https://github.com/uiid-systems/design-system/commit/74a147a62d14fbcb7c40c2b94f5ac7f259a8cdab))
* **ui:** omit owned keys from the forms, card, overlay, navigation and code slot props ([#724](https://github.com/uiid-systems/design-system/issues/724)) ([cd175bc](https://github.com/uiid-systems/design-system/commit/cd175bcda9a4736a9ecb4a596da2c57703ebf3ba))
* **ui:** omit the keys Menu, Avatar and Progress own from their slot props ([#721](https://github.com/uiid-systems/design-system/issues/721)) ([5230762](https://github.com/uiid-systems/design-system/commit/5230762745292ea20f516cc785ff3b98613917e5))
* **ui:** remove cxState and type Base UI part className as a string ([#688](https://github.com/uiid-systems/design-system/issues/688)) ([cbd6e16](https://github.com/uiid-systems/design-system/commit/cbd6e16672f6b2848920ac6860ad79683eaf7faa))
* **ui:** remove the remaining deprecated APIs ([#704](https://github.com/uiid-systems/design-system/issues/704)) ([61bcfb0](https://github.com/uiid-systems/design-system/commit/61bcfb010401ba1120824aba5b7383a1ccc5e691))
* **ui:** remove the Timeline component ([#662](https://github.com/uiid-systems/design-system/issues/662)) ([393a29a](https://github.com/uiid-systems/design-system/commit/393a29a9546ca9b052118abd9bf9a4a3f13ed3e5))
* **ui:** remove unused public API ([#645](https://github.com/uiid-systems/design-system/issues/645)) ([7f722d7](https://github.com/uiid-systems/design-system/commit/7f722d77f26563b9625bd0d61493bb9d2e7a1e1b))
* **ui:** replace fullwidth with w and delete the toggle ([#710](https://github.com/uiid-systems/design-system/issues/710)) ([0a941a4](https://github.com/uiid-systems/design-system/commit/0a941a4f037d3ddeb605910e8149c88c30a78f07))
* **ui:** replace fullwidth with w="full" in the lower layers ([#705](https://github.com/uiid-systems/design-system/issues/705)) ([dba2156](https://github.com/uiid-systems/design-system/commit/dba21564c63703cd9eda89dcb697fcff767b9761))

## [0.9.0](https://github.com/uiid-systems/design-system/compare/v0.8.0...v0.9.0) (2026-11-19)


### ⚠ BREAKING CHANGES

* **ui:** in a List with a marker, rows are list items, not flex containers, so a ListItem's ax, ay and gap no longer apply there and composed children flow as blocks. Icon and children rows now show a marker.
* **ui:** Text's shade no longer accepts "muted", "surface", "accent" or "halftone". Use emphasis="muted" for muted text. FieldDescription no longer takes shade; it defaults to emphasis="muted", and callers override it with emphasis.
* **ui:** a top-level prop now wins over the same key in RootProps in Select, Field, Combobox, Autocomplete, Progress, Collapsible, Tabs, Accordion, Popover, Tooltip, Dialog and Drawer. Collapsible's keepMounted wins over PanelProps.keepMounted.
* **ui:** a disabled first item is no longer auto-selected. That changes the trigger text and submitted value for a disabled sentinel row. Use placeholder instead of a disabled sentinel row.
* **ui:** Drawer's close API changes.
    - Every DrawerPopup now shows a header Close; a custom close in `action` duplicates it.
    - Remove that custom close, or pass `hideCloseButton` to keep your own.
    - DrawerClose takes Button's props without `render`, and defaults to variant="subtle".
    - Replace `<DrawerClose render={<Button size="small" />}>` with `<DrawerClose size="small">`.
    - A filled `render={<Button />}` close turns subtle.
    - Make a primary action a plain Button that sets `open` to false.
    - A bare `<DrawerClose>` changes from an unstyled button to a subtle Button.
* **ui:** @uiid/code no longer exports the DEFAULT_* constants, LANGUAGE_DISPLAY_NAMES, codeTypographyVariant, codeContentVariants, shikiVariants, HighlighterState or getSupportedLanguages, and HighlightOptions has no language field.
* **ui:** Combobox and Autocomplete type `items` as `readonly Value[]`. Grouped items no longer type-check on the monoliths; compose the parts for them. ComboboxItem and AutocompleteItem type `value` by `Value` (default `string`), not `any`.
* **tokens:** these CSS custom properties no longer exist: --globals-header-height, --globals-transition-duration-fast, --globals-transition-easing-spring, --globals-transform-origin and --globals-transform-scale-up. Define them locally if you used them.
* **ui:** when a key is set both at the top level and in RootProps, Slider and Switch now use the top-level value (RootProps used to win).
* **ui:** Direction type removed; use React's dir attribute type
* **ui:** ComboboxInput and AutocompleteInput now render their own input group. Wrapping either in ComboboxInputGroup or AutocompleteInputGroup nests a second group whose outer element takes the popup anchor. Drop the wrapper and pass InputGroupProps to the Input.
* **ui:** MenuItemType drops description and selected, which Menu never rendered.
* **ui:** FieldHint requires `text`; an icon-only hint no longer type-checks.
* **ui:** selectedRows, defaultSelectedRows and onSelectedRowsChange are typed TableRowId[] (string | number), so a handler typed (rows: number[]) no longer type-checks. Row checkboxes are named "Select row N", not "Select row".
* **ui:** the Field `errorType` prop and the `FieldErrorType` type are removed, along with the `FieldErrorTooltip` component. An error now always renders in the description's slot, replacing it.
* **ui:** AvatarImageProps (and Avatar's ImageProps) is now Base UI's Avatar.Image props for an <img>, not HTMLAttributes<HTMLSpanElement>.
* **ui:** List GroupProps no longer takes category, icon or items. It now takes Stack props for every group's root, e.g. className or gap.
* **ui:** BreadcrumbsList renders through Group, so its ref is typed for HTMLDivElement instead of HTMLOListElement.
* **ui:** Conversation's root no longer has role="log". The log is now the ConversationContent column, named "Conversation". Queries for the "Messages" group on the viewport no longer match.
* **ui:** typed toasts are colored by default; data.color now only overrides. The spinner slot `toast-spinner` is now `toast-icon`. ToastRoot no longer renders as a Card, so its className reaches the positioned element, not the surface.
* **ui:** Conversation's root no longer has role="log". The log is now the ConversationContent column, named "Conversation". Queries for the "Messages" group on the viewport no longer match.

### Features

* **ui:** add a header close to Drawer and render DrawerClose as a Button ([#633](https://github.com/uiid-systems/design-system/issues/633)) ([ce07b04](https://github.com/uiid-systems/design-system/commit/ce07b0432e2ec3979478491a80d243b72678f615))
* **ui:** add copyable, wrappable and fullscreenable props to CodeBlock ([#587](https://github.com/uiid-systems/design-system/issues/587)) ([50b981f](https://github.com/uiid-systems/design-system/commit/50b981fadca745b2a5057f0d55ad727779fd1861))
* **ui:** add link and image overrides to Markdown ([#544](https://github.com/uiid-systems/design-system/issues/544)) ([7b7f24e](https://github.com/uiid-systems/design-system/commit/7b7f24eeec745cf7f55ee51ef89caa0cae909068))
* **ui:** add TextareaProps to CodeEditor and name its textbox ([#569](https://github.com/uiid-systems/design-system/issues/569)) ([636da5b](https://github.com/uiid-systems/design-system/commit/636da5b43f352e59b5eae12caf5a8ba062607cc2))
* **ui:** add viewportRef to ConversationContent and headingLevel to its empty state ([#543](https://github.com/uiid-systems/design-system/issues/543)) ([847272b](https://github.com/uiid-systems/design-system/commit/847272bc59dd44b129b2d67ef3097d41c7c34822))
* **ui:** build Avatar on Base UI Avatar so it can show an image ([#601](https://github.com/uiid-systems/design-system/issues/601)) ([3ca6e3c](https://github.com/uiid-systems/design-system/commit/3ca6e3c3ffafe831fccf73803107647e82f7e2ec))
* **ui:** drop FieldHint's icon tooltip, so a hint is static text ([#604](https://github.com/uiid-systems/design-system/issues/604)) ([66fdda6](https://github.com/uiid-systems/design-system/commit/66fdda62fc355a6cdb8feb2a7b284d5c95d0e5b3))
* **ui:** extend Base UI's Item props on SelectItem and type its value by Select's Value ([#611](https://github.com/uiid-systems/design-system/issues/611)) ([e4cb63e](https://github.com/uiid-systems/design-system/commit/e4cb63e191ce1dcac0168fa6900e543bee71866a))
* **ui:** give each toast type an icon and hue, and split ToastRoot from its surface ([#548](https://github.com/uiid-systems/design-system/issues/548)) ([55f2d64](https://github.com/uiid-systems/design-system/commit/55f2d64669f1ed8ef631d0a3a9a8324c7e6c40ff))
* **ui:** key Table selection by row id with getRowId ([#605](https://github.com/uiid-systems/design-system/issues/605)) ([e826997](https://github.com/uiid-systems/design-system/commit/e826997223c6f3f694fe238953f9939b62685c27))
* **ui:** move Conversation's log role to the message column ([#540](https://github.com/uiid-systems/design-system/issues/540)) ([ca2773c](https://github.com/uiid-systems/design-system/commit/ca2773cd80a3139508691698bfecad34e0fa1df6))
* **ui:** overlays audit cleanups ([#626](https://github.com/uiid-systems/design-system/issues/626)) ([1274718](https://github.com/uiid-systems/design-system/commit/1274718b5225aa316ff6664c9caab6998034edc0))
* **ui:** publish Card's inline padding as custom properties ([#546](https://github.com/uiid-systems/design-system/issues/546)) ([bea22d3](https://github.com/uiid-systems/design-system/commit/bea22d38f8ade329706d2e0f8b6e016d6bca257d))
* **ui:** scroll only the Dialog body, keeping the header and footer in view ([#547](https://github.com/uiid-systems/design-system/issues/547)) ([c8fac64](https://github.com/uiid-systems/design-system/commit/c8fac64430a43c6c62fc986dec39fdefe2cf3d9c))
* **ui:** show one Field error, in place of the description ([#602](https://github.com/uiid-systems/design-system/issues/602)) ([d3f2164](https://github.com/uiid-systems/design-system/commit/d3f21641051850040a174ca8bfc98dd94a12c7a7))
* **ui:** wire Menu item onClick, disabled and icon, and pass Table's row to secondary actions ([#607](https://github.com/uiid-systems/design-system/issues/607)) ([369c6a1](https://github.com/uiid-systems/design-system/commit/369c6a1e64e04b44fedb101035b6bb3700426fae))


### Bug Fixes

* **storybook:** let Vite's dep scanner crawl [@uiid](https://github.com/uiid) packages and run browser tests in CI ([#625](https://github.com/uiid-systems/design-system/issues/625)) ([93eeb05](https://github.com/uiid-systems/design-system/commit/93eeb05b8d468a1f2a9d065657cf5f9344801af6))
* **tokens:** give a slotted ghost Input or Textarea the ghost placeholder ([#549](https://github.com/uiid-systems/design-system/issues/549)) ([8e07bfa](https://github.com/uiid-systems/design-system/commit/8e07bfa5e21daad168a068905e1e50bddec60281))
* **tokens:** make native form controls inherit the font family ([#586](https://github.com/uiid-systems/design-system/issues/586)) ([df29899](https://github.com/uiid-systems/design-system/commit/df298991bca78340a22306e6c77129515f0e0324))
* **tokens:** set the body and Kbd font from the --font-sans token ([#571](https://github.com/uiid-systems/design-system/issues/571)) ([83bd054](https://github.com/uiid-systems/design-system/commit/83bd05497cf3dddc9882eaf513c14cfb1239a9d3))
* **ui:** anchor the Combobox and Autocomplete popup to the control row ([#612](https://github.com/uiid-systems/design-system/issues/612)) ([c8b1b15](https://github.com/uiid-systems/design-system/commit/c8b1b15a98f83a1660892d48764a4b72618912d7))
* **ui:** buttons, cards, indicators and interactive audit cleanups ([#615](https://github.com/uiid-systems/design-system/issues/615)) ([4ee1fe2](https://github.com/uiid-systems/design-system/commit/4ee1fe295da73e6ff222b5aa7345ac75eb9eec7c))
* **ui:** call a consumer onChange from MaskInput ([#570](https://github.com/uiid-systems/design-system/issues/570)) ([3038e58](https://github.com/uiid-systems/design-system/commit/3038e585a8a3c3a2225d29b69938a6e713eb63b7))
* **ui:** cap the Popover popup's height so tall content scrolls in its body ([#593](https://github.com/uiid-systems/design-system/issues/593)) ([a9b501a](https://github.com/uiid-systems/design-system/commit/a9b501aae21e1594fe1de15349f7638898dc4daf))
* **ui:** color a slow first code highlight fully ([#590](https://github.com/uiid-systems/design-system/issues/590)) ([e94a7a9](https://github.com/uiid-systems/design-system/commit/e94a7a92802e43dc5f6fe9d7ac38fa230682dfff))
* **ui:** declare runtime sibling dependencies and cache generated icons ([#554](https://github.com/uiid-systems/design-system/issues/554)) ([252c7e1](https://github.com/uiid-systems/design-system/commit/252c7e174403ba75deb65b2443278aecc6062d7c))
* **ui:** draw List markers natively on every row ([#637](https://github.com/uiid-systems/design-system/issues/637)) ([ede63e7](https://github.com/uiid-systems/design-system/commit/ede63e7c316e985b26147512d2ec61516eb436a6))
* **ui:** export TableSelectionProvider and useTableSelection from tables ([#584](https://github.com/uiid-systems/design-system/issues/584)) ([a9b8d3b](https://github.com/uiid-systems/design-system/commit/a9b8d3b12a8009ab257f49ffaccc632abcec73a6))
* **ui:** form controls audit cleanups ([#622](https://github.com/uiid-systems/design-system/issues/622)) ([b69011a](https://github.com/uiid-systems/design-system/commit/b69011a6130890011113f3711b41dbe1f0099a04))
* **ui:** forward disabled from ResizableHandle to the separator ([#561](https://github.com/uiid-systems/design-system/issues/561)) ([1479a79](https://github.com/uiid-systems/design-system/commit/1479a792ab7d3d70498cb39fc7e00653e0620996))
* **ui:** give emphasis="muted" without a color the page's muted grey ([#629](https://github.com/uiid-systems/design-system/issues/629)) ([7c7e37b](https://github.com/uiid-systems/design-system/commit/7c7e37bf09072c5f20c714168275198f787c989e))
* **ui:** give every @uiid/icons barrel export a real type ([#608](https://github.com/uiid-systems/design-system/issues/608)) ([00bbb6f](https://github.com/uiid-systems/design-system/commit/00bbb6f005668d955a06892bfc482458fdf0600e))
* **ui:** give Popover and Tooltip string triggers a focus ring ([#579](https://github.com/uiid-systems/design-system/issues/579)) ([6c03dfe](https://github.com/uiid-systems/design-system/commit/6c03dfe17d5f4fa731ebb1afce8eef5652df4bef))
* **ui:** give relative specifiers in built declarations a .js extension ([#630](https://github.com/uiid-systems/design-system/issues/630)) ([cafa13f](https://github.com/uiid-systems/design-system/commit/cafa13f2bdae7068d6064eb535fdfe92988cd0f4))
* **ui:** hide the CodeBlock rows toggle when expanded code fits ([#624](https://github.com/uiid-systems/design-system/issues/624)) ([2cad9bb](https://github.com/uiid-systems/design-system/commit/2cad9bbf3d922ae954cba1bc3c115c87ed632f27))
* **ui:** honor cancel in Reasoning's onOpenChange and measure before paint ([#541](https://github.com/uiid-systems/design-system/issues/541)) ([dd18aa4](https://github.com/uiid-systems/design-system/commit/dd18aa465250e800aeea4a1a5d71321ebd7d0a83))
* **ui:** keep a render element's own title on Text ([#557](https://github.com/uiid-systems/design-system/issues/557)) ([2a3c4e8](https://github.com/uiid-systems/design-system/commit/2a3c4e82d6298fc0f9cf62c45c7c1b8f8699985e))
* **ui:** keep a single-select ToggleGroup from being emptied ([#585](https://github.com/uiid-systems/design-system/issues/585)) ([045e7d4](https://github.com/uiid-systems/design-system/commit/045e7d4c52ccf41865d8cf96d75c1f911e07eacf))
* **ui:** keep CodeEditor's caret on the highlighted text with line numbers or long lines ([#619](https://github.com/uiid-systems/design-system/issues/619)) ([3c0ed9b](https://github.com/uiid-systems/design-system/commit/3c0ed9b00d98b884b6c030c098f9ab9c6b7b085a))
* **ui:** keep Field's action at the label row's end without overlap ([#542](https://github.com/uiid-systems/design-system/issues/542)) ([6954dfd](https://github.com/uiid-systems/design-system/commit/6954dfd0b6fcd888a0a311086930ea950d78fc39))
* **ui:** keep Popover's offset defaults when PositionerProps is set ([#583](https://github.com/uiid-systems/design-system/issues/583)) ([cef70ef](https://github.com/uiid-systems/design-system/commit/cef70efb773cb71cce1418465798bf5b7a0cc144))
* **ui:** keep the caller's className on a FieldRow with no label ([#573](https://github.com/uiid-systems/design-system/issues/573)) ([d615d05](https://github.com/uiid-systems/design-system/commit/d615d05350360695c1286d4ddd5b159b7dfb0706))
* **ui:** keep the Status root when it has no children ([#560](https://github.com/uiid-systems/design-system/issues/560)) ([c77aed4](https://github.com/uiid-systems/design-system/commit/c77aed4848186aaac5e454cc5523c84cfa2f53f8))
* **ui:** keep the tooltip error in the DOM so the control is described ([#580](https://github.com/uiid-systems/design-system/issues/580)) ([3ee0754](https://github.com/uiid-systems/design-system/commit/3ee0754d1b776882367874d4824385857e210087))
* **ui:** layout, typography, lists, tables and navigation audit cleanups ([#627](https://github.com/uiid-systems/design-system/issues/627)) ([4b771dc](https://github.com/uiid-systems/design-system/commit/4b771dc68c44cc981806c2e92f4ab8fa96fef155))
* **ui:** let keyboard drags reorder Sortable items ([#603](https://github.com/uiid-systems/design-system/issues/603)) ([a77f9be](https://github.com/uiid-systems/design-system/commit/a77f9be54d356922f265a8f6cc4ef7f7b30d3ceb))
* **ui:** let List entries win over ItemProps and pass both to nested groups ([#596](https://github.com/uiid-systems/design-system/issues/596)) ([34c1a8e](https://github.com/uiid-systems/design-system/commit/34c1a8ee0f56f78c70b2a22831b851a47003f7f9))
* **ui:** let only the latest useFormSubmit call write state, add setResult ([#606](https://github.com/uiid-systems/design-system/issues/606)) ([4fa7183](https://github.com/uiid-systems/design-system/commit/4fa71833658c5dfa7673f388dd43919db9166414))
* **ui:** let top-level props win over RootProps everywhere ([#635](https://github.com/uiid-systems/design-system/issues/635)) ([d02375e](https://github.com/uiid-systems/design-system/commit/d02375e3d9bcc3859328b6288e64faf6baa80213))
* **ui:** make Accordion panel padding follow size ([#563](https://github.com/uiid-systems/design-system/issues/563)) ([a85ebd0](https://github.com/uiid-systems/design-system/commit/a85ebd06cd38b603409c40530bd0f0271a3ba867))
* **ui:** make Combobox and Autocomplete generic and label object items ([#623](https://github.com/uiid-systems/design-system/issues/623)) ([cba82fa](https://github.com/uiid-systems/design-system/commit/cba82fa3ecf9ba7434c5d68b8e3176b523ef9f09))
* **ui:** mark the current Breadcrumbs crumb and export its types ([#591](https://github.com/uiid-systems/design-system/issues/591)) ([fba2760](https://github.com/uiid-systems/design-system/commit/fba2760c05473fc3422f93f69d020c36dc72ccf9))
* **ui:** match Kbd space and modified letter or digit hotkeys ([#613](https://github.com/uiid-systems/design-system/issues/613)) ([063a3ee](https://github.com/uiid-systems/design-system/commit/063a3ee97bfd6f6f9b11b4275b612851053b429b))
* **ui:** merge consumer className and ref on ToggleGroup ([#566](https://github.com/uiid-systems/design-system/issues/566)) ([eafd237](https://github.com/uiid-systems/design-system/commit/eafd2378e7d3cd6b2a55a268b083c4093af12f8a))
* **ui:** merge Radio's FieldProps className into the row classes ([#562](https://github.com/uiid-systems/design-system/issues/562)) ([2d8d514](https://github.com/uiid-systems/design-system/commit/2d8d514ab8bf47a50587a79d6c52d9048480ec19))
* **ui:** name the popup scroll body, measure late children, and handle short screens ([#614](https://github.com/uiid-systems/design-system/issues/614)) ([37d45f2](https://github.com/uiid-systems/design-system/commit/37d45f2af6623781c73c415df429135323cfc886))
* **ui:** open CodeBlock fullscreen as a modal Base UI Dialog ([#616](https://github.com/uiid-systems/design-system/issues/616)) ([f3f96e4](https://github.com/uiid-systems/design-system/commit/f3f96e4034358875b4f8de2c83deaadf3171fe13))
* **ui:** pass Base UI's onValueChange through ToggleGroup ([#576](https://github.com/uiid-systems/design-system/issues/576)) ([fb126e2](https://github.com/uiid-systems/design-system/commit/fb126e2f7649c77bc5077c32d401beb17d4dcec5))
* **ui:** pass Select disabled to Root and Field ([#567](https://github.com/uiid-systems/design-system/issues/567)) ([be6eee6](https://github.com/uiid-systems/design-system/commit/be6eee64ac55bcaac53837f761baa442a01908f0))
* **ui:** remeasure the ToggleGroup indicator when toggles mount or unmount ([#600](https://github.com/uiid-systems/design-system/issues/600)) ([88390e6](https://github.com/uiid-systems/design-system/commit/88390e6f124722766ffec7c8037eb7e92bcf3ed2))
* **ui:** render Autocomplete's input group so InputGroupProps applies ([#588](https://github.com/uiid-systems/design-system/issues/588)) ([199b0af](https://github.com/uiid-systems/design-system/commit/199b0afe6866fe6014914417ade17833bceedf42))
* **ui:** render unsupported code languages as plain code ([#581](https://github.com/uiid-systems/design-system/issues/581)) ([0c4ded0](https://github.com/uiid-systems/design-system/commit/0c4ded0725b1122e7d86ea27dd7df6365872db88))
* **ui:** respect reduced motion in Toast, Drawer and shared popups ([#575](https://github.com/uiid-systems/design-system/issues/575)) ([fab19c8](https://github.com/uiid-systems/design-system/commit/fab19c8d6ff056f620c78f6e38f053cad424e5e3))
* **ui:** round Tool's trigger to the card's inner radius ([#545](https://github.com/uiid-systems/design-system/issues/545)) ([131498a](https://github.com/uiid-systems/design-system/commit/131498a69d5de2ab89eaf83b7d1cb4b07eb1f8a9))
* **ui:** run RootProps.onOpenChange alongside onOpenChange in Popover and Tooltip ([#572](https://github.com/uiid-systems/design-system/issues/572)) ([8e64768](https://github.com/uiid-systems/design-system/commit/8e647681e98469d566347148382c5da1ec0a5913))
* **ui:** scroll a tall Drawer's body, keeping the header and footer in view ([#594](https://github.com/uiid-systems/design-system/issues/594)) ([b498e61](https://github.com/uiid-systems/design-system/commit/b498e61342953404aba98abcfec4fb5227f19acc))
* **ui:** Select, Combobox, Autocomplete, Field and Form audit cleanups ([#634](https://github.com/uiid-systems/design-system/issues/634)) ([c66c7bf](https://github.com/uiid-systems/design-system/commit/c66c7bfe5a3027f87e2a0ec0eb89508e12e8e0c5))
* **ui:** set success and result from useFormSubmit and drop its default delay ([#598](https://github.com/uiid-systems/design-system/issues/598)) ([368293e](https://github.com/uiid-systems/design-system/commit/368293e610e68095f671ac4a9c19fde6e6e3c9b1))
* **ui:** show a focus ring on CodeEditor when its textarea has focus ([#574](https://github.com/uiid-systems/design-system/issues/574)) ([b4f2493](https://github.com/uiid-systems/design-system/commit/b4f2493f03af78546be9130f4ecfe4196675d3ed))
* **ui:** show the required marker on Combobox and Autocomplete labels ([#568](https://github.com/uiid-systems/design-system/issues/568)) ([5a6ccc6](https://github.com/uiid-systems/design-system/commit/5a6ccc6af852b8abdb528c41665105e8d1082e2e))
* **ui:** skip the Popover trigger when none is passed ([#565](https://github.com/uiid-systems/design-system/issues/565)) ([5d67377](https://github.com/uiid-systems/design-system/commit/5d673771b330cc4b92842f19d7a4fcfea3051755))
* **ui:** stop @uiid/tables importing itself by package name ([#564](https://github.com/uiid-systems/design-system/issues/564)) ([b05eb1e](https://github.com/uiid-systems/design-system/commit/b05eb1eb56a9ec90ed5f2259ea3ee4e017961de1))
* **ui:** stop Switch from using its name as its id ([#559](https://github.com/uiid-systems/design-system/issues/559)) ([4e34b44](https://github.com/uiid-systems/design-system/commit/4e34b4420a472e3b38686bb3e9c4003445e645f6))
* **ui:** stop Table cells printing null, undefined and [object Object] ([#577](https://github.com/uiid-systems/design-system/issues/577)) ([7b81730](https://github.com/uiid-systems/design-system/commit/7b8173093a0795c8732a611d8c07a5dcd736b51e))
* **ui:** stop Tabs crashing on an empty items array ([#558](https://github.com/uiid-systems/design-system/issues/558)) ([107b32e](https://github.com/uiid-systems/design-system/commit/107b32eba14ba9da05a37220b11714e9bafaa621))
* **ui:** take the CodeEditor highlight backdrop out of the tab order ([#582](https://github.com/uiid-systems/design-system/issues/582)) ([c7e1509](https://github.com/uiid-systems/design-system/commit/c7e1509617a2cdc9cf006c7716e35fa87b09566f))
* **ui:** widen the Icon type to accept any component that takes IconProps ([#578](https://github.com/uiid-systems/design-system/issues/578)) ([09da570](https://github.com/uiid-systems/design-system/commit/09da570812d3ee5ab8657b553ef4d80eeacfff67))


### Performance Improvements

* **docs:** highlight docs code blocks on the server ([#628](https://github.com/uiid-systems/design-system/issues/628)) ([1a5a7a2](https://github.com/uiid-systems/design-system/commit/1a5a7a2a4c8a0070308e147251610a9b95b345b5))
* **ui:** load the Shiki runtime only when CodeInline or CodeBlock highlights ([#610](https://github.com/uiid-systems/design-system/issues/610)) ([4460b33](https://github.com/uiid-systems/design-system/commit/4460b3385c37bcc45d8bf08cd764e8fd69e1971a))
* **ui:** skip Shiki in CodeInline and CodeBlock when nothing needs highlighting ([#595](https://github.com/uiid-systems/design-system/issues/595)) ([9a4db26](https://github.com/uiid-systems/design-system/commit/9a4db26561a60a24feeb9004652acb46d037f9c3))


### Code Refactoring

* **tokens:** tokens, utils, icons and barrel audit cleanups ([#621](https://github.com/uiid-systems/design-system/issues/621)) ([90172bc](https://github.com/uiid-systems/design-system/commit/90172bc33184c6174693d250a298e8814feff03a))
* **ui:** code and AI audit cleanups ([#631](https://github.com/uiid-systems/design-system/issues/631)) ([7af9a8f](https://github.com/uiid-systems/design-system/commit/7af9a8fb36d0960e495fe1154c20285d632f3fcc))
* **ui:** narrow Text's shade to foreground and background ([#636](https://github.com/uiid-systems/design-system/issues/636)) ([69227c3](https://github.com/uiid-systems/design-system/commit/69227c3fc1354022cd9571c1620c3e227a1c8c5c))

## [0.8.0](https://github.com/uiid-systems/design-system/compare/v0.7.2...v0.8.0) (2026-11-10)


### ⚠ BREAKING CHANGES

* **ui:** Stack children with no explicit width now stretch across the column.
* **ui:** Reveal no longer accepts the balance prop.
* **ui:** a disabled Button no longer carries the native disabled attribute by default. Pass focusableWhenDisabled={false} for the old behavior.

### Features

* **tokens:** add --palette-on-tint-muted ([#525](https://github.com/uiid-systems/design-system/issues/525)) ([c6b86ee](https://github.com/uiid-systems/design-system/commit/c6b86ee1114198a657744f033fa037469c2427c9))
* **ui:** add full and screen sizing keywords ([#497](https://github.com/uiid-systems/design-system/issues/497)) ([22520ab](https://github.com/uiid-systems/design-system/commit/22520ab380782147702a679d058d89bf0e1d29a6))
* **ui:** add pending to Dialog ([#499](https://github.com/uiid-systems/design-system/issues/499)) ([13d6bc7](https://github.com/uiid-systems/design-system/commit/13d6bc7976c7e370314387ce0a11fcd228ea625f))
* **ui:** add pending to Drawer ([#503](https://github.com/uiid-systems/design-system/issues/503)) ([7f13314](https://github.com/uiid-systems/design-system/commit/7f1331441dad5ced78ff6933167973b853ac69a0))
* **ui:** add streaming word reveal to Markdown ([#504](https://github.com/uiid-systems/design-system/issues/504)) ([fe8d368](https://github.com/uiid-systems/design-system/commit/fe8d368d75af78a968e120039abf7283f039d74d))
* **ui:** default Stack ax to stretch ([#534](https://github.com/uiid-systems/design-system/issues/534)) ([9971940](https://github.com/uiid-systems/design-system/commit/9971940f16afdc85bc9f6dac128e2b8a65cf8130))
* **ui:** expose @uiid/design-system/utils subpath ([#532](https://github.com/uiid-systems/design-system/issues/532)) ([68cbb70](https://github.com/uiid-systems/design-system/commit/68cbb706bb9b909b996680691da2047f2dd94f3f))
* **ui:** extract @uiid/markdown from @uiid/ai ([#510](https://github.com/uiid-systems/design-system/issues/510)) ([09dda64](https://github.com/uiid-systems/design-system/commit/09dda646e089f107ed3abe40f12bea821d4f5709))
* **ui:** focus the control from slot padding and make slots inert when disabled ([#533](https://github.com/uiid-systems/design-system/issues/533)) ([88a3375](https://github.com/uiid-systems/design-system/commit/88a337549ba4b10b3d90e2998e0a7e8f29ca1ab3))
* **ui:** keep a disabled Button focusable by default ([#514](https://github.com/uiid-systems/design-system/issues/514)) ([4fbe845](https://github.com/uiid-systems/design-system/commit/4fbe84595df38edeff7bbb372b28800a10d4bb73))
* **ui:** keep InputWrapper mounted and size it from its own variants ([#539](https://github.com/uiid-systems/design-system/issues/539)) ([1e5ca61](https://github.com/uiid-systems/design-system/commit/1e5ca610bdaedbdaaacbed739e38e7d2c7e5f7d6))
* **ui:** make the Card shadow and footer divider opt-in ([#498](https://github.com/uiid-systems/design-system/issues/498)) ([691e716](https://github.com/uiid-systems/design-system/commit/691e71658ca540601a750356d48d9202d5722334))
* **ui:** name Message turns as groups and take ml/maxw style props ([#531](https://github.com/uiid-systems/design-system/issues/531)) ([8dea179](https://github.com/uiid-systems/design-system/commit/8dea179d0700b70a00dbee25b9822cbb76a0c3b9))
* **ui:** publish @uiid/markdown and re-export it from @uiid/design-system ([#537](https://github.com/uiid-systems/design-system/issues/537)) ([4edc71c](https://github.com/uiid-systems/design-system/commit/4edc71c001f1f5bce3b5273086f9b3a94861bd6b))
* **ui:** stagger Reveal per chunk, freeze word timing, drop balance ([#517](https://github.com/uiid-systems/design-system/issues/517)) ([aee920d](https://github.com/uiid-systems/design-system/commit/aee920db125f3580fde7ffc8ad8ad5d917ef9ea3))
* **ui:** take ReactNode label and description on Field and carry required to its control ([#520](https://github.com/uiid-systems/design-system/issues/520)) ([4dc1a0f](https://github.com/uiid-systems/design-system/commit/4dc1a0f8cd92a6ef4532d33157564ca1ab5dc964))


### Bug Fixes

* **tokens:** read only direct children for disabled-within and invalid ([#508](https://github.com/uiid-systems/design-system/issues/508)) ([0dce526](https://github.com/uiid-systems/design-system/commit/0dce5260ee2ed289f408542eb545c97aaed3cfaf))
* **tokens:** stop the spin animation under prefers-reduced-motion ([#506](https://github.com/uiid-systems/design-system/issues/506)) ([4f071aa](https://github.com/uiid-systems/design-system/commit/4f071aa9c0b3fe27bdb69e046e71d4699b9078b1))
* **ui:** clip the Collapsible panel vertically and respect reduced motion ([#530](https://github.com/uiid-systems/design-system/issues/530)) ([657817a](https://github.com/uiid-systems/design-system/commit/657817a8829191c4aaaa3605ffbdd3e18d4774e4))
* **ui:** describe Button with its string tooltip and keep an inferred nativeButton ([#515](https://github.com/uiid-systems/design-system/issues/515)) ([a6580e9](https://github.com/uiid-systems/design-system/commit/a6580e965bda38b8c7ea457f2faa589aaf681972))
* **ui:** dim the outer dialog under a nested dialog's forced backdrop ([#524](https://github.com/uiid-systems/design-system/issues/524)) ([d2bda86](https://github.com/uiid-systems/design-system/commit/d2bda86b5ac8e665f867e9a305ed505721e3e92d))
* **ui:** give a bare Field its box back once an inline error renders ([#527](https://github.com/uiid-systems/design-system/issues/527)) ([131c7b8](https://github.com/uiid-systems/design-system/commit/131c7b8db7d8d9d3555cfdafa7b99d8633d70e4e))
* **ui:** give Tooltip a composes-tooltip composition with a max width ([#522](https://github.com/uiid-systems/design-system/issues/522)) ([a053716](https://github.com/uiid-systems/design-system/commit/a0537167eea70c9d1f8f1c66e30a73cf8bbefbb3))
* **ui:** hand Combobox and Autocomplete's disabled to Field ([#535](https://github.com/uiid-systems/design-system/issues/535)) ([587ded8](https://github.com/uiid-systems/design-system/commit/587ded8f15e016a8fb91a416c33c5e44a5041743))
* **ui:** hand Conversation's scroll button focus to the viewport ([#519](https://github.com/uiid-systems/design-system/issues/519)) ([79ae970](https://github.com/uiid-systems/design-system/commit/79ae970cc5931a89de20a0d9c18db74360323429))
* **ui:** hand Input and Textarea's disabled and fullwidth to Field ([#512](https://github.com/uiid-systems/design-system/issues/512)) ([3518986](https://github.com/uiid-systems/design-system/commit/3518986908732b9fef63d325fa0ee3b320a70b44))
* **ui:** hand MaskInput's id and value to FieldControl ([#511](https://github.com/uiid-systems/design-system/issues/511)) ([5621540](https://github.com/uiid-systems/design-system/commit/562154084db64ab4d5491728421305ff1d245e87))
* **ui:** hand Textarea's id and value to FieldControl ([#507](https://github.com/uiid-systems/design-system/issues/507)) ([aef9cc9](https://github.com/uiid-systems/design-system/commit/aef9cc9cd4e09ebfc524b10fc2806f0288a18c6f))
* **ui:** harden Tool against unserializable values, empty children and long content ([#516](https://github.com/uiid-systems/design-system/issues/516)) ([f6fad01](https://github.com/uiid-systems/design-system/commit/f6fad0193b51a2ccede90bcfae1de46115047736))
* **ui:** hold PromptInput's uncontrolled draft in state ([#529](https://github.com/uiid-systems/design-system/issues/529)) ([5c22164](https://github.com/uiid-systems/design-system/commit/5c22164664260d080d900bd625311dc7c0f3056b))
* **ui:** hold trailing markers and restart the pace per stream in useStreamPace ([#538](https://github.com/uiid-systems/design-system/issues/538)) ([bf4f426](https://github.com/uiid-systems/design-system/commit/bf4f426adb5b01c5cd76958e21fb3174ece06497))
* **ui:** keep Shimmer static in print and forced colors ([#521](https://github.com/uiid-systems/design-system/issues/521)) ([cc28a5f](https://github.com/uiid-systems/design-system/commit/cc28a5f55ce92928a185ec4a2ba41264eb40189f))
* **ui:** keep the label at the start of a reversed Checkbox or Radio row ([#536](https://github.com/uiid-systems/design-system/issues/536)) ([fe1cf5d](https://github.com/uiid-systems/design-system/commit/fe1cf5dcf409d81bb948fc67ad0677a39547036d))
* **ui:** label Tool's finished states Done, Failed and Skipped ([#523](https://github.com/uiid-systems/design-system/issues/523)) ([1509017](https://github.com/uiid-systems/design-system/commit/1509017c463733953eb768aa0885ab27ccce178c))
* **ui:** release Conversation's pin on any scroll up and re-pin on resize ([#513](https://github.com/uiid-systems/design-system/issues/513)) ([c00b938](https://github.com/uiid-systems/design-system/commit/c00b938b972864cff250652d9666ffb09efc9069))
* **ui:** remove gap from Text and Prose ([#502](https://github.com/uiid-systems/design-system/issues/502)) ([c65511e](https://github.com/uiid-systems/design-system/commit/c65511e117c5ec769d9c3f4ac05696f84229221a))
* **ui:** show a disabled Send when PromptInput has no onStop ([#509](https://github.com/uiid-systems/design-system/issues/509)) ([ef18461](https://github.com/uiid-systems/design-system/commit/ef184618d17189dbd9f086ae41a9d75fbdb64155))
* **ui:** trim Prose's last-child block-end margin ([#518](https://github.com/uiid-systems/design-system/issues/518)) ([eca74ae](https://github.com/uiid-systems/design-system/commit/eca74ae129386c66f50e220b58e46c660e9c0f22))

## [0.7.2](https://github.com/uiid-systems/design-system/compare/v0.7.1...v0.7.2) (2026-10-30)


### Features

* **ui:** add a grow toggle to Box and grow a Card's body with it ([#480](https://github.com/uiid-systems/design-system/issues/480)) ([a53c18e](https://github.com/uiid-systems/design-system/commit/a53c18ef2fd70639a26d5eb8521cc9334926f1a2))
* **ui:** add a shell Card variant for page-level content areas ([#481](https://github.com/uiid-systems/design-system/issues/481)) ([50af402](https://github.com/uiid-systems/design-system/commit/50af402adb212f6b7efec9d684985adf555fcead))
* **ui:** add InputWrapper orientation and Textarea before/after slots ([#487](https://github.com/uiid-systems/design-system/issues/487)) ([ba753a4](https://github.com/uiid-systems/design-system/commit/ba753a4eb7edbf44d876cc1af49d25594e644610))
* **ui:** add Shimmer text effect ([#488](https://github.com/uiid-systems/design-system/issues/488)) ([f553e4c](https://github.com/uiid-systems/design-system/commit/f553e4c709966975c37fd04915eeee68a8257591))
* **ui:** step up the icon size in large buttons ([#482](https://github.com/uiid-systems/design-system/issues/482)) ([09ca451](https://github.com/uiid-systems/design-system/commit/09ca45102e5e3e4a48940c26ad544e6fe3f21536))


### Bug Fixes

* **ui:** give Dialog and Drawer backdrops a dark scrim from global tokens ([#479](https://github.com/uiid-systems/design-system/issues/479)) ([aeb6803](https://github.com/uiid-systems/design-system/commit/aeb68032c7a4bf503e77a95f9325da2483af9e50))

## [0.7.1](https://github.com/uiid-systems/design-system/compare/v0.7.0...v0.7.1) (2026-10-21)


### Features

* **ui:** add Dialog close button, DialogClose part, and full size ([#474](https://github.com/uiid-systems/design-system/issues/474)) ([0c6b02b](https://github.com/uiid-systems/design-system/commit/0c6b02b6e4cc20607502b5916dc62a6eb7da07f1))
* **ui:** add keepMounted and clickableHeader to CollapsibleCard ([#475](https://github.com/uiid-systems/design-system/issues/475)) ([eec449f](https://github.com/uiid-systems/design-system/commit/eec449f3283aee044aa9b9b2d800667b2ab132f5))
* **ui:** add wrap prop to Text ([#471](https://github.com/uiid-systems/design-system/issues/471)) ([df522e7](https://github.com/uiid-systems/design-system/commit/df522e7bb74a1fe80d5c0222db5fc4a109a716a9))


### Bug Fixes

* **ui:** derive style-prop keys from one source and apply gap on Text ([#466](https://github.com/uiid-systems/design-system/issues/466)) ([970f55f](https://github.com/uiid-systems/design-system/commit/970f55fc02a4ca4eef9ad6f905f402d5da4bdb8f))
* **ui:** drop tailwind-merge from cx ([#464](https://github.com/uiid-systems/design-system/issues/464)) ([ed2081f](https://github.com/uiid-systems/design-system/commit/ed2081fc9f27c19512e2ea7f4a42f0a8dbd974c9))
* **ui:** harden cards, buttons, overlays, and CSS layering ([#463](https://github.com/uiid-systems/design-system/issues/463)) ([37f5f98](https://github.com/uiid-systems/design-system/commit/37f5f984f09f1feccce1321975cfdc913cd53acc))
* **ui:** keep resolved triggers and tooltip defaults when props are undefined ([#473](https://github.com/uiid-systems/design-system/issues/473)) ([42442df](https://github.com/uiid-systems/design-system/commit/42442df0b0a06c91f30766ce0325674165c7593c))
* **ui:** match ghost button hover to subtle hover ([#470](https://github.com/uiid-systems/design-system/issues/470)) ([517370e](https://github.com/uiid-systems/design-system/commit/517370e91d674c30e0b0d770b47b392cef7bf3b8))
* **ui:** swipe toasts toward their edge, resize on update, and tidy loading toasts ([#472](https://github.com/uiid-systems/design-system/issues/472)) ([66c3978](https://github.com/uiid-systems/design-system/commit/66c3978620a983ee11c4464a6821623fdb394e0d))
* **ui:** type data-* and aria-* attributes on layout primitives ([#467](https://github.com/uiid-systems/design-system/issues/467)) ([3238843](https://github.com/uiid-systems/design-system/commit/3238843dca76ac0fc99be9f0dc44a959adac3934))

## [0.7.0](https://github.com/uiid-systems/design-system/compare/v0.6.7...v0.7.0) (2026-10-10)


### ⚠ BREAKING CHANGES

* **ui:** Card drops the `icon` prop, `IconProps`, `CardIcon`, `CardIconProps`, and `CardHeader`. Dialog, Drawer, and Popover drop the `icon` prop they forwarded to Card. `HeaderProps` now targets the whole header region.

### Features

* **ui:** add CollapsibleCard ([#459](https://github.com/uiid-systems/design-system/issues/459)) ([a1c6c8f](https://github.com/uiid-systems/design-system/commit/a1c6c8f688e758de4985be9410e043ce0d984d93))
* **ui:** add emphasis prop to Text ([#451](https://github.com/uiid-systems/design-system/issues/451)) ([49e7ec3](https://github.com/uiid-systems/design-system/commit/49e7ec3e3eccbe7334946ebc9c2c743d0c3097c7))
* **ui:** add uppercase prop to Text ([#462](https://github.com/uiid-systems/design-system/issues/462)) ([ee2dccf](https://github.com/uiid-systems/design-system/commit/ee2dccffbc12ba89cc7de40ba08bc0196d3f0656))
* **ui:** add wrap and flex props to layout components ([#460](https://github.com/uiid-systems/design-system/issues/460)) ([d095714](https://github.com/uiid-systems/design-system/commit/d0957144dc981630f1a0a08009173e8e6376f7a0))
* **ui:** flow card header text around a top-right action ([#449](https://github.com/uiid-systems/design-system/issues/449)) ([bff6409](https://github.com/uiid-systems/design-system/commit/bff6409ddbd5ee1675ed9ff1e3dcc07a53a63262))


### Bug Fixes

* **ui:** honor itemToStringLabel on Select ([#457](https://github.com/uiid-systems/design-system/issues/457)) ([ebbb1a7](https://github.com/uiid-systems/design-system/commit/ebbb1a7bdb42b36b1578407b8916ccefc27b82e6))
* **ui:** inherit size and family in a nested Text ([#455](https://github.com/uiid-systems/design-system/issues/455)) ([2230104](https://github.com/uiid-systems/design-system/commit/223010445ddc10cc593848940ba7b4491db2b612))
* **ui:** keep an icon-only button's tooltip name when the caller forwards an empty label ([#453](https://github.com/uiid-systems/design-system/issues/453)) ([8522d0e](https://github.com/uiid-systems/design-system/commit/8522d0eb034c26717177ec25058808d3227591bb))
* **ui:** make Table min-width opt-in and add size tiers ([#461](https://github.com/uiid-systems/design-system/issues/461)) ([e2f1ec5](https://github.com/uiid-systems/design-system/commit/e2f1ec5a8f2b7628cd29648ba852cdd3d92049f4))
* **ui:** render composed Card titles as a row, not inside a heading ([#458](https://github.com/uiid-systems/design-system/issues/458)) ([7356df3](https://github.com/uiid-systems/design-system/commit/7356df3aba4f021003b9fdfb1e8e3cc1d846518a))
* **ui:** render no trigger in Dialog and Drawer when none is given ([#456](https://github.com/uiid-systems/design-system/issues/456)) ([b28be13](https://github.com/uiid-systems/design-system/commit/b28be131be8a617ce2c0623e6aa4a54dd78636ff))

## [0.6.7](https://github.com/uiid-systems/design-system/compare/v0.6.6...v0.6.7) (2026-09-26)


### Features

* **ui:** productionize Progress ([#447](https://github.com/uiid-systems/design-system/issues/447)) ([204d34f](https://github.com/uiid-systems/design-system/commit/204d34f776ddb48d486d1aaa0b94e338f251b2bc))
* **ui:** render title, type, close, action and custom content in Toaster ([#446](https://github.com/uiid-systems/design-system/issues/446)) ([a9ab57a](https://github.com/uiid-systems/design-system/commit/a9ab57a84840c7bf1496ec71c6edc022bf54f4cf))

## [0.6.6](https://github.com/uiid-systems/design-system/compare/v0.6.5...v0.6.6) (2026-09-25)


### Bug Fixes

* **ui:** resolve a lazily wrapped render element before checking it ([#443](https://github.com/uiid-systems/design-system/issues/443)) ([5c51fcc](https://github.com/uiid-systems/design-system/commit/5c51fcc1acd33b9eb713d407a8f4fd9b1a23a188))

## [0.6.5](https://github.com/uiid-systems/design-system/compare/v0.6.4...v0.6.5) (2026-09-25)


### ⚠ BREAKING CHANGES

* **ui:** @uiid/utils no longer exports compose; use the composes key in a cva config instead.

### Bug Fixes

* **ui:** migrate to cva 1.0.0-beta.12 ([#439](https://github.com/uiid-systems/design-system/issues/439)) ([1aecb1e](https://github.com/uiid-systems/design-system/commit/1aecb1e0651fb84b5612eb5483665b371a5d887b))


### Miscellaneous Chores

* **docs:** remove stale SPEC.md ([#442](https://github.com/uiid-systems/design-system/issues/442)) ([e5e50af](https://github.com/uiid-systems/design-system/commit/e5e50afe41adf8441bd3ce207582a73f92d10678))

## [0.6.4](https://github.com/uiid-systems/design-system/compare/v0.6.3...v0.6.4) (2026-09-25)


### Features

* **ui:** resolve Box toggles from data attributes and retire three ([#434](https://github.com/uiid-systems/design-system/issues/434)) ([d4595fd](https://github.com/uiid-systems/design-system/commit/d4595fd5c4efe35cdf39d19e47f74bc7e0dad33b))
* **ui:** resolve style props from data attributes in a props layer ([#433](https://github.com/uiid-systems/design-system/issues/433)) ([ae58c2c](https://github.com/uiid-systems/design-system/commit/ae58c2ca84ca9dffcc6ef319179561f7c7e52034))
* **ui:** resolve Text props from data attributes ([#437](https://github.com/uiid-systems/design-system/issues/437)) ([1505d0b](https://github.com/uiid-systems/design-system/commit/1505d0bb8156a1a1061762a57c562b817340adb3))
* **ui:** scale slider readout, thumb and track with the size tier ([#436](https://github.com/uiid-systems/design-system/issues/436)) ([5df66f9](https://github.com/uiid-systems/design-system/commit/5df66f9ee45cf64f0095d2f201686d82946cbfe5))


### Bug Fixes

* **ui:** correct style prop values and drop unused prop metadata ([#431](https://github.com/uiid-systems/design-system/issues/431)) ([f8c0559](https://github.com/uiid-systems/design-system/commit/f8c05594e2be26895ec9b10189ecc426d164acf1))
* **ui:** keep renderWithProps' composed ref stable across renders ([#427](https://github.com/uiid-systems/design-system/issues/427)) ([939653d](https://github.com/uiid-systems/design-system/commit/939653df6693866d9f72eae15ad1eb354b1ef79c))
* **ui:** keep sortable item and handle refs stable across renders ([#430](https://github.com/uiid-systems/design-system/issues/430)) ([e8ad74b](https://github.com/uiid-systems/design-system/commit/e8ad74bcdc75eb3c17e2a0c73212867664ba244e))
* **ui:** mount Button's loading spinner only while it is loading ([#435](https://github.com/uiid-systems/design-system/issues/435)) ([52b50e0](https://github.com/uiid-systems/design-system/commit/52b50e0110d136658d47b0c4f5713e0e1a5553b1))
* **ui:** scope ListItem's icon rule to the icon it renders ([#426](https://github.com/uiid-systems/design-system/issues/426)) ([e6c0612](https://github.com/uiid-systems/design-system/commit/e6c0612ccca2f930bda462f80513f03d857d3ad9))

## [0.6.3](https://github.com/uiid-systems/design-system/compare/v0.6.2...v0.6.3) (2026-09-23)


### Bug Fixes

* **ui:** chain renderWithProps handlers, swap the spinner's SMIL for pausable CSS ([#424](https://github.com/uiid-systems/design-system/issues/424)) ([d9464c6](https://github.com/uiid-systems/design-system/commit/d9464c6e713355862b5d1dcb5a94651ad780580d))

## [0.6.2](https://github.com/uiid-systems/design-system/compare/v0.6.1...v0.6.2) (2026-09-22)


### Features

* **ui:** give Base UI parts the layout props of the primitive they render ([#422](https://github.com/uiid-systems/design-system/issues/422)) ([37a9e60](https://github.com/uiid-systems/design-system/commit/37a9e603720f9caa35acd6b8b630c15d2ef0b55b))
* **ui:** give Collapsible Stack layout props and a state-aware trigger ([#418](https://github.com/uiid-systems/design-system/issues/418)) ([ce7c3b9](https://github.com/uiid-systems/design-system/commit/ce7c3b95fc72a6a89b1a7df92a1d9d4b23dd5663))


### Bug Fixes

* **ui:** give non-button overlay and Menu triggers button semantics ([#420](https://github.com/uiid-systems/design-system/issues/420)) ([6e30b52](https://github.com/uiid-systems/design-system/commit/6e30b525c53ccfa6f4641493aae13f86c75ff151))
* **ui:** let Tabs' TabProps and PanelProps leave the value to each item ([#423](https://github.com/uiid-systems/design-system/issues/423)) ([29dc5c3](https://github.com/uiid-systems/design-system/commit/29dc5c3577ad62af3bcc4b5a01f6bd12cc740a6a))
* **ui:** resolve a Base UI state-function className instead of dropping it ([#421](https://github.com/uiid-systems/design-system/issues/421)) ([161382f](https://github.com/uiid-systems/design-system/commit/161382f7b4ab9dabe13c2dc32ed68694eb1f8e5e))

## [0.6.1](https://github.com/uiid-systems/design-system/compare/v0.6.0...v0.6.1) (2026-09-20)


### Features

* **ui:** add hover states to bordered checkbox, radio and switch rows ([#407](https://github.com/uiid-systems/design-system/issues/407)) ([de120ae](https://github.com/uiid-systems/design-system/commit/de120ae96566c75d11ee743040cfa23ecfce791c))
* **ui:** dim the page behind an open Select or Menu popup ([#416](https://github.com/uiid-systems/design-system/issues/416)) ([a1e7586](https://github.com/uiid-systems/design-system/commit/a1e758666c35c10ea7a374f8baa3ddc89e24bec2))
* **ui:** fade in edge shadows when a table scrolls horizontally ([#413](https://github.com/uiid-systems/design-system/issues/413)) ([3775e1a](https://github.com/uiid-systems/design-system/commit/3775e1a0f5e73e77919353d071d5242ebcf6ab3f))
* **ui:** scale field chrome with its control size ([#409](https://github.com/uiid-systems/design-system/issues/409)) ([f859524](https://github.com/uiid-systems/design-system/commit/f859524fc1278d7ce0f4888377b3dc670ab9c803))


### Bug Fixes

* **ui:** center button content narrower than its loading spinner ([#411](https://github.com/uiid-systems/design-system/issues/411)) ([03cd610](https://github.com/uiid-systems/design-system/commit/03cd6108afd50d3a504cb6a9cb94645d3fc76111))
* **ui:** center number field stepper glyphs and give them their own surface ([#410](https://github.com/uiid-systems/design-system/issues/410)) ([c0ab5b1](https://github.com/uiid-systems/design-system/commit/c0ab5b1c787293b792e673b152f730d71082814d))
* **ui:** hold one shape as the pagination window slides ([#417](https://github.com/uiid-systems/design-system/issues/417)) ([de36bc0](https://github.com/uiid-systems/design-system/commit/de36bc08f19e2fe9647b290b621f752b80eca52d))
* **ui:** route DOM attributes to the control, not the headless root ([#412](https://github.com/uiid-systems/design-system/issues/412)) ([668d12e](https://github.com/uiid-systems/design-system/commit/668d12e6bd30a942b486b9f4e2ffe4948edc32ee))

## [0.6.0](https://github.com/uiid-systems/design-system/compare/v0.5.2...v0.6.0) (2026-09-19)


### ⚠ BREAKING CHANGES

* **ui:** hint and HintProps are removed; pass action instead

### Features

* **ui:** let select items render a node ([#404](https://github.com/uiid-systems/design-system/issues/404)) ([9b10e8e](https://github.com/uiid-systems/design-system/commit/9b10e8e25f6b66d27b8d743b01089654c22ef561))
* **ui:** replace Field's hint with a generic action slot ([#405](https://github.com/uiid-systems/design-system/issues/405)) ([a2f4ba4](https://github.com/uiid-systems/design-system/commit/a2f4ba40762977a98250b831b18e9bc6c51fe2f0))

## [0.5.2](https://github.com/uiid-systems/design-system/compare/v0.5.1...v0.5.2) (2026-09-19)


### Features

* **ui:** add a numbered page window to pagination ([#401](https://github.com/uiid-systems/design-system/issues/401)) ([4fa15be](https://github.com/uiid-systems/design-system/commit/4fa15be33dcc6f77bcbe27142b9d3c47f880e91f))
* **ui:** hook up pagination page state ([#400](https://github.com/uiid-systems/design-system/issues/400)) ([c832b5f](https://github.com/uiid-systems/design-system/commit/c832b5fe8705381a564812698a72fdcb53fcfb77))
* **ui:** render pagination controls as links ([#403](https://github.com/uiid-systems/design-system/issues/403)) ([f543b62](https://github.com/uiid-systems/design-system/commit/f543b629db9863e0e4c57fa451131c5d21975ed1))


### Bug Fixes

* **ui:** keep link semantics for a button rendered as a link ([#399](https://github.com/uiid-systems/design-system/issues/399)) ([007e485](https://github.com/uiid-systems/design-system/commit/007e4854465fb872e9b5eac2345143c2b36f8b66))
* **ui:** keep List's class when given a className ([#397](https://github.com/uiid-systems/design-system/issues/397)) ([d6d8471](https://github.com/uiid-systems/design-system/commit/d6d84718704d1b614fa3cc86ef6492551dbd9759))
* **ui:** name icon-only buttons from their tooltip ([#398](https://github.com/uiid-systems/design-system/issues/398)) ([83075df](https://github.com/uiid-systems/design-system/commit/83075df091e1a7856b4d2f0c68fe6857672c9aa7))
* **ui:** size select value text by its size tier ([#395](https://github.com/uiid-systems/design-system/issues/395)) ([b350511](https://github.com/uiid-systems/design-system/commit/b350511fc688fa18ad574266a0abd4d5182d8ecc))

## [0.5.1](https://github.com/uiid-systems/design-system/compare/v0.5.0...v0.5.1) (2026-09-14)


### Bug Fixes

* **release:** publish to npm with trusted publishing ([#393](https://github.com/uiid-systems/design-system/issues/393)) ([8b4cb48](https://github.com/uiid-systems/design-system/commit/8b4cb487d7e1648c2717cd459dc98a3a9c442e9e))

## [0.5.0](https://github.com/uiid-systems/design-system/compare/v0.4.1...v0.5.0) (2026-09-14)


### ⚠ BREAKING CHANGES

* **ui:** direction is removed; pass orientation instead

### Features

* **ui:** add size prop to checkbox and radio groups ([#388](https://github.com/uiid-systems/design-system/issues/388)) ([3d4d27b](https://github.com/uiid-systems/design-system/commit/3d4d27b716f7e8e163253db5f806968c627bbd06))
* **ui:** rename group direction prop to orientation ([#392](https://github.com/uiid-systems/design-system/issues/392)) ([ab78c32](https://github.com/uiid-systems/design-system/commit/ab78c325b7056fd4f69a8b7230df0a5a8deac862))


### Bug Fixes

* **ui:** make bordered toggle rows clickable across their padding ([#389](https://github.com/uiid-systems/design-system/issues/389)) ([4963e9b](https://github.com/uiid-systems/design-system/commit/4963e9be66288fc31c63c12b8796f46da7894ed5))
* **ui:** make fullwidth stretch checkbox and radio groups ([#391](https://github.com/uiid-systems/design-system/issues/391)) ([da3cd1d](https://github.com/uiid-systems/design-system/commit/da3cd1d2a0a35c240236cf23334589729734e3b2))

## [0.4.1](https://github.com/uiid-systems/design-system/compare/v0.4.0...v0.4.1) (2026-09-13)


### Features

* **ui:** add fullwidth to toggle group ([#385](https://github.com/uiid-systems/design-system/issues/385)) ([f2e433a](https://github.com/uiid-systems/design-system/commit/f2e433a2884d70df4c0986c4a63bba0dce6ccb27))


### Bug Fixes

* **ui:** make unselected checkbox and radio visible ([#387](https://github.com/uiid-systems/design-system/issues/387)) ([47ad67b](https://github.com/uiid-systems/design-system/commit/47ad67b598d7b5c33fdd1cc424e9e16131e2ae4d))

## [0.4.0](https://github.com/uiid-systems/design-system/compare/v0.3.0...v0.4.0) (2026-09-07)


### ⚠ BREAKING CHANGES

* **ui:** `ToggleGroup` and `Tabs` no longer accept `size="sm" | "md" | "lg"`. Use `xsmall | small | medium | large`. Shipped as a straight break rather than an alias period — pre-1.0, no consumer outside the repo passes either prop, and the codebase has no deprecation precedent to follow.

### Features

* **ui:** add color prop to Input and Textarea via the shared field surface ([#369](https://github.com/uiid-systems/design-system/issues/369)) ([69d7d8a](https://github.com/uiid-systems/design-system/commit/69d7d8a9dfab04fbf581b806f01bbeb033fcedee))
* **ui:** align toggle group and tabs size vocabulary with the system tiers ([#378](https://github.com/uiid-systems/design-system/issues/378)) ([5279f43](https://github.com/uiid-systems/design-system/commit/5279f431a10f65e4d2c9bba10ea6bb27d8fbfb97))
* **ui:** derive the tint hover token and scope list theming to the popup ([#382](https://github.com/uiid-systems/design-system/issues/382)) ([3baab7b](https://github.com/uiid-systems/design-system/commit/3baab7b1123936c097616443c6fe12d60b4ee903))


### Bug Fixes

* **storybook:** move the ignore step into a script to fit Vercel's limit ([#377](https://github.com/uiid-systems/design-system/issues/377)) ([caf4c98](https://github.com/uiid-systems/design-system/commit/caf4c9802b7c2c8a560dd1a1d865f22beb846d56))
* **storybook:** unbreak the Vercel Storybook deploy ([#376](https://github.com/uiid-systems/design-system/issues/376)) ([cd36068](https://github.com/uiid-systems/design-system/commit/cd3606847991d3725e47436e8a480762bf7c5857))
* **ui:** correct toggle group disabled, multi-select and width behaviour ([#381](https://github.com/uiid-systems/design-system/issues/381)) ([4d0f056](https://github.com/uiid-systems/design-system/commit/4d0f0561d57628774ca969a12bfe7dd5abd1f9bc))
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
