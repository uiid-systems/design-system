---
"@uiid/cards": patch
---

Trim the cards package: remove the unexported `ActionCard` (and its broken story), rewrite the README in short-form, add `card.examples.tsx` consumed by per-variant Storybook stories, add Cards Overview + Card MDX docs, and regenerate `card.tokens.css` to drop the stale `--card-size-*` vars.
