---
"@uiid/code": patch
---

Polish `CodeBlock`: add language icon (Devicon SVGs auto-shown when `language` is set), wrap toggle (`ToggleButton` + `WrapText` icon), and auto expand/collapse (footer toggle when `rows` overflows). Copy button is now icon-only with a `tooltip` swap.

Simplified the public API: removed `copyable`, `wrappable`, controlled `wrap`, `expandable`, and `showLanguageIcon`. Use `defaultWrap` / `onWrapChange` and `defaultExpanded` to seed/observe state. Both action buttons always render. New escape hatches: `LanguageIconProps`, `WrapButtonProps`. `CodeBlockHeader` subcomponent retains `copyable` / `wrappable` flags for direct consumers like `CodeEditor`.
