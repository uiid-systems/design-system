---
"@uiid/interactive": patch
---

Fix ToggleGroup active indicator flashing in from zero-width on load. The indicator is now positioned before first paint and only animates on subsequent user interaction, so it snaps into place instead of sliding in on mount (including under SSR).
