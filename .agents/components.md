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

## Sharing code between components

Never duplicate. How you share depends on what the shared thing _is_.

**Standalone components may be imported directly**, including from a sibling
directory. A component that renders another component is ordinary composition —
Badge renders Status, and a composite form control may render Input and
Checkbox. Those stay where they live; do not hoist them into a shared
directory. The same applies to importing a component's _variant styles_ from its
source rather than copying them (Input → Select).

**Fragments get abstracted.** When the shared thing is not a component in its own
right — a popup tree, a label row, a control surface — put it in a neutral shared
module instead of having one component reach into a sibling for it. See
`packages/forms/src/shared/` (the combobox/autocomplete popup layer and input
group) and `packages/forms/src/field/subcomponents/field-row.tsx`, shared by
checkbox, switch and radio.

The test is whether the thing could stand on its own as a documented component.
If yes, import it. If it is only ever a piece of something else, share it
neutrally so neither component owns the other.

## Creating a new package

1. Create the package directory under `packages/`
2. Add `package.json`, `tsconfig.json`, and `vite.config.ts` (using `createViteConfig`)
3. Create `src/index.ts` barrel export
4. Add `src/vite-env.d.ts` for CSS module types
5. **Register the stories path in `apps/storybook/.storybook/main.ts`**
6. **Register the package alias in `vitest.config.ts`**
7. Run `pnpm install` to link the workspace package

Steps 5 and 6 fail silently — skip them and the package's stories and tests simply never run, with no error.
