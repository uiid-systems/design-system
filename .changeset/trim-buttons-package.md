---
"@uiid/buttons": patch
"@uiid/tokens": patch
---

Trim the buttons package: rewrite both READMEs (button, toggle-button) in short-form, add `button.examples.tsx` and `toggle-button.examples.tsx` consumed by per-variant Storybook stories + a Playground each, add Buttons Overview / Button / Toggle Button MDX docs, regenerate `button.tokens.css` to drop the dead `--button-border-width`, `--button-border-radius`, and `--button-padding-y` vars, and tighten both test files (parameterized matrices, dropped redundant and class-name-only assertions, focused toggle-button tests on the toggle-specific behavior).
