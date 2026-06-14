---
"@uiid/tokens": patch
---

Internal cleanup. Delete the duplicate `src/schema/theme-input.ts`, `src/schema/__tests__/`, and `src/schema/examples/` left over from when the schema migrated to `@uiid/themes` in #132. The public `./schema` export continues to re-export from `@uiid/themes/schema` via `src/schema/index.ts` — no API change for consumers.
