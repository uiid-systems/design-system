---
"@uiid/cards": patch
"@uiid/tokens": patch
---

Fix Card referencing dead CSS vars (`--text-0-weight`, `--text-0-letterSpacing`) left over from the typography refit in #212 — corrected to `--text-0-font-weight` and `--text-0-letter-spacing`. Migrate `typography.tokens.json` to the DTCG composite `$type: "typography"` token format and teach the generator to decompose composite tokens into per-property CSS vars; the emitted CSS output is unchanged.
