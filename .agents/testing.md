---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "vitest.config.ts"
  - "vitest.setup.ts"
---

# Testing

Tests are configured at the **root level** and run across all packages via `vitest.config.ts` and `vitest.setup.ts` (jest-dom matchers). Test files live alongside components as `{component}.test.tsx`.

```bash
pnpm test:run                    # Run all tests (from root)
pnpm test                        # Watch mode
pnpm test:run packages/buttons   # Specific package
```

For patterns — rendering, `data-slot` verification, variant props, user interaction, controlled/uncontrolled state, disabled states, and accessibility — read an existing test rather than working from a template. `packages/typography/src/text/text.test.tsx` and `packages/buttons/src/button/button.test.tsx` are good references.

A new package's tests will not run until its alias is registered in `vitest.config.ts`. This fails silently.
