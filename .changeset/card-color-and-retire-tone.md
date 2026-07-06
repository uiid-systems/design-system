---
"@uiid/cards": patch
"@uiid/forms": patch
"@uiid/registry": patch
---

Add a palette-driven `color` prop to Card (one hue resolves background, foreground, and border via oklch + light-dark) and retire the vestigial tone token concept. Form validation (invalid radio/checkbox and the required-field asterisk) now uses the raw `--color-red` primitive instead of the undefined `--tone-critical`.
