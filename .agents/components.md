---
paths:
  - "packages/**/*.tsx"
  - "packages/**/*.types.ts"
  - "packages/**/*.variants.ts"
  - "packages/**/index.ts"
---

# Component Conventions

Each component is a directory of `{name}.tsx`, `.types.ts`, `.variants.ts`, `.constants.ts`, `.module.css`, `.test.tsx`, `.examples.tsx`, and `README.md`. Subcomponents live in a `subcomponents/` directory. Match `packages/typography/src/text/`.

Components use kebab-case filenames and PascalCase names. Set `data-slot` on the root element, merge classNames with `cx()` from `@uiid/utils`, spread remaining props to the root, and add `"use client"` for client components.

Prefer simple monolithic components for common cases, exporting subcomponents for advanced composition. Expose frequently-used props directly rather than forcing them through nested prop objects.

Mirror the Base UI API — never rename a primitive or recast a prop it already ships. Additions must be additive.

## Use UIID utilities, not the upstream libraries

When porting components from shadcn or Radix patterns, substitute:

| External                    | UIID                                                    |
| --------------------------- | ------------------------------------------------------- |
| `@radix-ui/react-slot`      | `renderWithProps` from `@uiid/utils`                    |
| `@radix-ui/react-direction` | `useDirection` from `@base-ui/react/direction-provider` |
| `class-variance-authority`  | `cva` from `@uiid/utils` (pre-configured)               |
| `clsx` / `tailwind-merge`   | `cx` from `@uiid/utils`                                 |

Use regular elements for domain components. Only use `renderWithProps` for low-level layout primitives (`Box`, `Text`).

Share variant styles across components by importing from the source component rather than duplicating them (for example Badge → Status, Input → Select).

## Creating a new package

1. Create the package directory under `packages/`
2. Add `package.json`, `tsconfig.json`, and `vite.config.ts` (using `createViteConfig`)
3. Create `src/index.ts` barrel export
4. Add `src/vite-env.d.ts` for CSS module types
5. **Register the stories path in `apps/storybook/.storybook/main.ts`**
6. **Register the package alias in `vitest.config.ts`**
7. Run `pnpm install` to link the workspace package

Steps 5 and 6 fail silently — skip them and the package's stories and tests simply never run, with no error.
