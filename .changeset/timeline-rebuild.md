---
"@uiid/indicators": patch
"@uiid/registry": patch
---

Rebuild Timeline on a subgrid `media` / rail / content layout: a prominent leading media column (avatar/icon) right-aligned to the rail, a continuous connector masked behind status-colored dots, and dot/media centered on the title's first line. Removes `orientation` (vertical-only), the internal subscription store, and the dead `TimelineHeader`; renames `TimelineDot` → `TimelineMarker` and adds `TimelineMedia`. Also removes the inert Avatar `size` prop (fixing its underlying token-mismatch sizing bug) and makes Avatar `name`/`description` optional.
