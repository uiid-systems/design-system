# Component Patterns

## File Structure

```
{component-name}/
├── {component-name}.tsx           # Component implementation
├── {component-name}.types.ts      # TypeScript types
├── {component-name}.constants.ts  # Default values and constants
├── {component-name}.module.css    # Styles (CSS Modules)
├── {component-name}.stories.tsx   # Storybook stories
├── {component-name}.test.tsx      # Unit tests
└── README.md                      # Component documentation
```

If a component has subcomponents, place them in a `subcomponents/` directory:

```
{component-name}/
├── {component-name}.tsx
├── subcomponents/
│   ├── {subcomponent-name}.tsx
│   └── index.ts
└── ...
```

## Naming Conventions

| Type            | Convention                     | Example                      |
| --------------- | ------------------------------ | ---------------------------- |
| Component files | kebab-case                     | `date-picker.tsx`            |
| Component names | PascalCase                     | `DatePicker`                 |
| Type files      | kebab-case with `.types.ts`    | `date-picker.types.ts`       |
| CSS Modules     | kebab-case with `.module.css`  | `date-picker.module.css`     |
| Constants       | SCREAMING_SNAKE_CASE           | `DATE_PICKER_DEFAULT_FORMAT` |
| Props types     | PascalCase with `Props` suffix | `DatePickerProps`            |

## Standard Component Template

```tsx
"use client";

import { SomeBase } from "@base-ui/react/some-base";
import { cx } from "@uiid/utils";

import { COMPONENT_DEFAULT_VALUE } from "./component.constants";
import type { ComponentProps } from "./component.types";
import styles from "./component.module.css";

export const Component = ({
  prop = COMPONENT_DEFAULT_VALUE,
  className,
  ...props
}: ComponentProps) => {
  return (
    <SomeBase
      data-slot="component"
      className={cx(styles["component"], className)}
      {...props}
    />
  );
};
Component.displayName = "Component";
```

Key patterns:
1. **"use client"** directive at top for client components
2. **data-slot** attribute for element identification
3. **cx()** utility from `@uiid/utils` for className merging
4. **displayName** for debugging
5. **Spread remaining props** to the root element

## Monolithic Components with Exposed Subcomponents

Design components as simple, monolithic components for common use cases while exporting subcomponents for advanced composition.

1. **Prefer simple components** — use the simple API first. Only use composed subcomponents for genuinely complex builds.
2. **Expose common props directly** — don't require users to pass frequently-used props through nested prop objects.
3. **Keep nested prop objects for overrides** — maintain `RootProps`, `ThumbProps`, etc. for cases where users need to pass additional props to specific subcomponents.
4. **Export all subcomponents** — allow consumers to compose themselves if needed, but document as advanced usage.

```ts
// Extend the base props directly for common usage
export type SwitchProps = SwitchRootProps & {
  RootProps?: SwitchRootProps;
  ThumbProps?: SwitchThumbProps;
  label?: string;
  labelPosition?: "before" | "after";
};
```

## Package Exports

Each package exports from `src/index.ts`:

```ts
export { Component } from "./component/component";
export type { ComponentProps } from "./component/component.types";
```

## Converting External Components

When adapting components from external sources (shadcn, Radix patterns, etc.):

| Content                                             | File                       |
| --------------------------------------------------- | -------------------------- |
| Component name constants (`ROOT_NAME`, `ITEM_NAME`) | `{component}.constants.ts` |
| All TypeScript types and interfaces                 | `{component}.types.ts`     |
| React contexts and `use{X}Context` hooks            | `{component}.context.ts`   |
| Custom hooks (`useStore`, `useLazyRef`, etc.)       | `{component}.hooks.ts`     |
| Pure utility functions                              | `{component}.utils.ts`     |
| CVA variant definitions                             | `{component}.variants.ts`  |

Use regular elements (not render props) for domain components. Only use `renderWithProps` for low-level layout primitives (`Box`, `Text`).

| External                    | UIID Alternative                                        |
| --------------------------- | ------------------------------------------------------- |
| `@radix-ui/react-slot`      | `renderWithProps` from `@uiid/utils`                    |
| `@radix-ui/react-direction` | `useDirection` from `@base-ui/react/direction-provider` |
| `class-variance-authority`  | `cva` from `@uiid/utils` (pre-configured)               |
| `clsx` / `tailwind-merge`   | `cx` from `@uiid/utils`                                 |

## Creating a New Package

1. Create the package directory under `packages/`
2. Add `package.json`, `tsconfig.json`, and `vite.config.ts` (using `createViteConfig`)
3. Create `src/index.ts` barrel export
4. Add `src/vite-env.d.ts` for CSS module types
5. **Register in Storybook** — add the stories path to `apps/storybook/.storybook/main.ts`
6. **Register in Vitest** — add the package alias to `vitest.config.ts`
7. Run `pnpm install` to link the workspace package

## Known Bugs

### `@base-ui/react` — Controlled RadioGroup causes stack overflow

**Status:** Open (upstream bug)
**Affected tests:** `packages/forms/src/radio/radio.test.tsx` and `packages/forms/src/radio-group/radio-group.test.tsx` — "supports controlled value" (skipped)

**Description:** When using `RadioGroup` as a controlled component (passing `value` + `onValueChange`), clicking a radio button triggers infinite recursion in base-ui's `useStableCallback` trampoline. Uncontrolled usage (no `value` prop) works fine.
