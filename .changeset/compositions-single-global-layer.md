---
"@uiid/tokens": patch
---

Deliver shared composition primitives as a single global stylesheet instead of inlining them per consumer.

`@uiid/tokens/compositions.module.css` — composed by file path, which copied the entire file into every consuming module — is replaced by a plain global `@uiid/tokens/compositions.css` whose classes are prefixed `composes-*` (e.g. `.composes-text`, `.composes-disabled`) and loaded once via the tokens globals. Component modules now reference them with `composes: composes-<name> from global`, which appends the class name without copying the rule. This removes ~22 duplicate `@layer uiid.compositions` blocks from the shipped CSS (down to one) with no change to component APIs or the cascade.
