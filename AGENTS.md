# AI Agent Guidelines

This document provides instructions for AI coding assistants working on the UIID Design System. Follow these conventions to maintain consistency across the codebase.

## Project Overview

UIID is a modular React component library built with:

- **React 19** with TypeScript 5.8
- **Vite 7** for builds
- **Base UI** (`@base-ui-components/react`) for accessible primitives
- **CSS Modules** with design tokens
- **pnpm workspaces** + **Turbo** for monorepo management
- **Vitest** for testing
- **Storybook** for documentation

## Monorepo Structure

```
design-system/
├── apps/                    # Consumer applications
│   ├── json-render/         # AI-powered UI generator (has its own AGENTS.md)
│   └── storybook/           # Component documentation
├── packages/                # Component packages (@uiid/*)
│   ├── buttons/
│   ├── calendars/
│   ├── cards/
│   ├── forms/
│   ├── icons/
│   ├── indicators/
│   ├── interactive/
│   ├── layout/
│   ├── navigation/
│   ├── overlays/
│   ├── tables/
│   ├── tokens/
│   ├── typography/
│   └── utils/
├── scripts/                 # Custom build scripts (token generation, etc.)
├── templates/               # Templates for documentation and code
├── vite.config.ts           # Shared Vite build config factory
├── vitest.config.ts         # Shared test configuration (runs all package tests)
├── vitest.setup.ts          # Test setup with jest-dom matchers
└── AGENTS.md                # This file
```

## Apps

### json-render (`apps/json-render/`)

An AI-powered playground that generates UIs from natural language using a JSON tree structure and UIID components. When working on this app, refer to its own `apps/json-render/AGENTS.md` for JSON tree format, available components, and layout patterns specific to tree generation.

### Storybook (`apps/storybook/`)

Component documentation and visual testing. See [Storybook Stories](#storybook-stories) for story writing guidelines.

## Root Configuration Files

Shared tooling configs live at the repository root:

| File               | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `vite.config.ts`   | Shared Vite build config factory            |
| `vitest.config.ts` | Test configuration for all packages         |
| `vitest.setup.ts`  | Test setup (jest-dom matchers)              |
| `tsconfig.json`    | Base TypeScript config (packages extend it) |
| `turbo.json`       | Turbo task orchestration                    |
| `eslint.config.js` | Shared ESLint configuration                 |

### Vite Configuration

The root `vite.config.ts` exports a `createViteConfig()` factory function. Packages import and use it:

```ts
import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: ["@base-ui/react"], // Additional externals
  cssLayer: "uiid.components", // Optional CSS layer wrapping
  preserveDirectives: false, // Default: true
});
```

**Options:**

- `external` - Additional dependencies to exclude from bundle (React and @uiid/\* are always external)
- `cssLayer` - CSS layer name for postcss wrapper (e.g., "uiid.components")
- `preserveDirectives` - Whether to preserve "use client" directives (default: true)

**Special cases:** `icons` and `utils` packages have custom configs due to unique requirements.

## Scripts Directory

The `scripts/` directory contains **custom build scripts** specific to this project:

| Script                                | Purpose                              |
| ------------------------------------- | ------------------------------------ |
| `generate-tokens.cjs`                 | Converts JSON design tokens to CSS   |
| `postcss-layer-wrapper.cjs`           | PostCSS plugin for CSS layer scoping |
| `vite-plugin-preserve-directives.mjs` | Vite plugin to preserve "use client" |
| `build-changelog.mjs`                 | Generates changelog from changesets  |
| `auto-changeset.mjs`                  | Automates changeset creation         |

**Note:** Standard config files (vitest, tsconfig, eslint) belong at the root, not in scripts.

## Component File Structure

Each component should follow this structure:

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

### Subcomponents

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

## Component Implementation

### Standard Component Template

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

### Key Patterns

1. **"use client"** directive at top for client components
2. **data-slot** attribute for element identification
3. **cx()** utility from `@uiid/utils` for className merging
4. **displayName** for debugging
5. **Spread remaining props** to the root element

### Monolithic Components with Exposed Subcomponents

Components should be designed as simple, monolithic components for common use cases, while also exporting subcomponents for advanced composition.

**Design principles:**

1. **Prefer simple components** - Always use the simple component API over composed subcomponents. If a feature is commonly needed and isn't available, add it to the simple component first. Only use composed subcomponents for genuinely complex builds that can't be reasonably supported by the simple API.

2. **Expose common props directly** - Don't require users to pass frequently-used props through nested prop objects (e.g., `RootProps`). Instead, extend the underlying component's props type and spread them to the root element.

3. **Keep nested prop objects for overrides** - Maintain `RootProps`, `ThumbProps`, etc. for cases where users need to pass additional or overriding props to specific subcomponents.

4. **Export all subcomponents** - Allow consumers to compose the component themselves if they need full control, but document this as the advanced usage pattern.

**Example type pattern:**

```ts
// Extend the base props directly for common usage
export type SwitchProps = SwitchRootProps & {
  RootProps?: SwitchRootProps; // For additional/override props
  ThumbProps?: SwitchThumbProps; // For subcomponent props
  label?: string; // Component-specific props
  labelPosition?: "before" | "after";
};
```

**Example implementation:**

```tsx
export const Switch = ({
  RootProps,
  ThumbProps,
  label,
  ...props // Common props like checked, onCheckedChange
}: SwitchProps) => {
  return (
    <SwitchRoot {...props} {...RootProps}>
      <SwitchThumb {...ThumbProps} />
    </SwitchRoot>
  );
};
```

**Usage for consumers:**

```tsx
// Simple usage - common props at top level
<Switch checked={checked} onCheckedChange={setChecked} label="Dark mode" />

// Advanced usage - compose with subcomponents
<SwitchRoot checked={checked} onCheckedChange={setChecked}>
  <CustomLabel>Dark mode</CustomLabel>
  <SwitchThumb className="custom-thumb" />
</SwitchRoot>
```

## Testing

### Test Setup

Tests are configured at the **root level** and run across all packages:

- `vitest.config.ts` (root) - Shared Vitest configuration
- `vitest.setup.ts` (root) - Test setup with jest-dom matchers

Test files live alongside components in each package as `{component}.test.tsx`.

### Test File Template

When creating tests, use the comprehensive template at:

**`templates/COMPONENT_TEST.md`**

This template includes patterns for:

- Rendering and data-slot verification
- Variant props (size, variant, tone)
- User interactions (click, keyboard)
- Controlled/uncontrolled state
- Disabled and loading states
- Accessibility checks
- Subcomponent props

**Quick reference:**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Component } from "./component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    render(<Component onClick={vi.fn()} />);
    await user.click(screen.getByRole("button"));
  });
});
```

### Running Tests

```bash
# Run all tests (from root)
pnpm test:run

# Watch mode (from root)
pnpm test

# Run tests for specific file pattern
pnpm test:run packages/buttons
```

## Documentation

### Component README

When creating README files for components, use the template at:

**`templates/COMPONENT_README.md`**

This template includes:

- Usage examples
- Props table
- Data attributes
- CSS variables
- File structure

### Storybook Stories

When creating stories, use the template at:

**`templates/COMPONENT_STORY.md`**

**Story writing guidelines:**

1. **Group variations in a single story** - Keep all component variations (sizes, states, variants) together in one story using the render function. This helps visualize the component's full API at a glance.

2. **Use Stack for layout** - Wrap multiple component examples in `<Stack>` for consistent vertical spacing.

3. **One story per component** - Each component should have a single "Default" story that showcases all its variations. Only create additional stories for genuinely complex experiences (e.g., multi-step flows, interactive demos with state).

4. **Prefer simple components** - Stories should demonstrate the simple component API. Only show composed subcomponent usage if it's the only way to achieve a specific pattern.

5. **Use argTypes for controls** - Expose key props as Storybook controls, grouped by category (Toggles, Options, Text, Subcomponents).

**Example:**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Component } from "./component";

const meta = {
  title: "Category/Component",
  component: Component,
  args: {
    // Default args
  },
  argTypes: {
    disabled: { control: "boolean", table: { category: "Toggles" } },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Options" },
    },
    label: { control: "text", table: { category: "Text" } },
  },
  render: (args) => (
    <Stack gap={4}>
      <Component {...args} />
      <Component {...args} variant="secondary" />
      <Component {...args} size="small" />
      <Component {...args} disabled />
    </Stack>
  ),
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Component",
};
```

### Pull Request Descriptions

When creating pull requests for new features or packages, use the template at:

**`templates/PR_DESCRIPTION.md`**

**Required sections:**

| Section       | When to Include                                      |
| ------------- | ---------------------------------------------------- |
| **Summary**   | Always - bullet-point overview                       |
| **Test plan** | Always - verification checklist                      |
| **Details**   | For new packages, components, or significant changes |

**Test plan must include:**

1. Build verification: `pnpm build --filter=@uiid/{package}`
2. Test verification: `pnpm test:run packages/{package}`
3. Storybook verification (if UI changes)
4. Feature-specific verification steps

For small fixes or minor changes, a brief summary and test plan is sufficient.

## Styling

### No Inline Styles for Layout or Typography

**Never use `style={{}}` for layout, spacing, sizing, or text styling.** The resolution order is:

1. **Component props** (always try first) — `gap`, `p`, `ax`, `evenly`, `fullwidth`, `size`, `shade`, etc.
2. **CSS Modules** — for visual styling that can't be expressed as props (colors, borders, animations)
3. **Inline styles** — avoid entirely. If you think you need one, check the component README for a prop that does the same thing.

**If no prop exists for what you need, stop and ask the user.** Do not fall back to inline styles. The prop may already exist and you missed it, or it may be worth adding to the component.

Common mistakes to avoid:

| Instead of...                                  | Use...                        |
| ---------------------------------------------- | ----------------------------- |
| `style={{ flex: 1 }}` on children              | `<Group evenly>`              |
| `style={{ width: "100%" }}`                    | `fullwidth` or `ax="stretch"` on parent Stack |
| `style={{ alignItems: "center" }}`             | `ay="center"` (Group) or `ax="center"` (Stack) |
| `style={{ gap: "16px" }}`                      | `gap={4}`                     |
| `style={{ padding: "16px" }}`                  | `p={4}`                       |
| `style={{ fontSize: "14px", color: "gray" }}`  | `<Text size={0} shade="muted">` |

See layout and typography component READMEs for full prop references and common patterns.

### Prefer Component Props Over CSS

**Always use layout and typography components with style props instead of writing CSS or using Tailwind classes.** This ensures consistency and leverages our design token system.

#### Layout Components (`@uiid/layout`)

Use `Stack`, `Group`, and `Box` for layout instead of CSS flexbox:

| Component | Purpose                       |
| --------- | ----------------------------- |
| `Stack`   | Vertical flex layout (column) |
| `Group`   | Horizontal flex layout (row)  |
| `Box`     | Generic flex container        |

**Spacing Props** (available on all layout components):

| Prop                               | CSS Property              | Example           |
| ---------------------------------- | ------------------------- | ----------------- |
| `gap`                              | gap                       | `<Stack gap={2}>` |
| `p`                                | padding                   | `<Box p={4}>`     |
| `px`                               | padding-inline            | `<Box px={2}>`    |
| `py`                               | padding-block             | `<Box py={3}>`    |
| `pt`, `pb`, `pl`, `pr`             | padding-block-start, etc. | `<Group pb={4}>`  |
| `m`                                | margin                    | `<Stack m={2}>`   |
| `mx`, `my`, `mt`, `mb`, `ml`, `mr` | margin variants           | `<Text mb={4}>`   |

**Layout Props** (available on layout components):

| Prop        | CSS Property    | Values                                               |
| ----------- | --------------- | ---------------------------------------------------- |
| `ax`        | justify-content | `start`, `center`, `end`, `space-between`, `stretch` |
| `ay`        | align-items     | `start`, `center`, `end`, `baseline`, `stretch`      |
| `direction` | flex-direction  | `row`, `column`                                      |

**Toggle Props**:

| Prop         | Effect              |
| ------------ | ------------------- |
| `fullwidth`  | width: 100%         |
| `fullheight` | height: 100%        |
| `evenly`     | flex: 1 on children |

#### Conditional Rendering Utilities (`@uiid/layout`)

Use `ConditionalRender` and `SwitchRender` to conditionally wrap content without duplicating props or creating messy ternaries.

**ConditionalRender** - Wrap content in a component only when condition is true:

```tsx
// Instead of:
{
  showWrapper ? <Card>{children}</Card> : children;
}

// Use:
<ConditionalRender condition={showWrapper} render={<Card />}>
  {children}
</ConditionalRender>;
```

| Prop        | Type           | Description                                   |
| ----------- | -------------- | --------------------------------------------- |
| `condition` | `boolean`      | Whether to wrap content                       |
| `render`    | `ReactElement` | Wrapper element (used when condition is true) |
| `children`  | `ReactNode`    | Content to render                             |

**SwitchRender** - Switch between two wrapper components based on condition:

```tsx
// Instead of duplicating shared props:
{
  isVertical ? (
    <Stack gap={2} p={4} data-slot="container" className={styles.container}>
      {children}
    </Stack>
  ) : (
    <Group gap={2} p={4} data-slot="container" className={styles.container}>
      {children}
    </Group>
  );
}

// Use SwitchRender with shared props:
<SwitchRender
  condition={isVertical}
  render={{ true: <Stack />, false: <Group /> }}
  gap={2}
  p={4}
  data-slot="container"
  className={styles.container}
>
  {children}
</SwitchRender>;
```

| Prop        | Type                                          | Description                                 |
| ----------- | --------------------------------------------- | ------------------------------------------- |
| `condition` | `boolean`                                     | Which wrapper to use                        |
| `render`    | `{ true: ReactElement, false: ReactElement }` | Wrapper options                             |
| `children`  | `ReactNode`                                   | Content to render                           |
| `...props`  | `HTMLAttributes`                              | **Shared props passed to selected wrapper** |

**Key benefit**: Any additional props on `SwitchRender` are automatically passed to whichever wrapper is selected. This eliminates prop duplication and keeps code DRY.

**Real-world example** (Timeline component):

```tsx
// Timeline switches between Stack (vertical) and Group (horizontal)
<SwitchRender
  condition={orientation === "vertical"}
  render={{ true: <Stack gap={2} />, false: <Group gap={2} /> }}
  role="list"
  aria-orientation={orientation}
  data-slot="timeline"
  className={cx(styles["timeline"], className)}
  {...props}
>
  {children}
</SwitchRender>
```

#### Typography Component (`@uiid/typography`)

Use `Text` for all text content instead of raw HTML elements:

```tsx
// Instead of CSS for text styling:
<span className={styles["label"]}>Label</span>

// Use Text with props:
<Text size={0} shade="muted" weight="bold">Label</Text>
```

**Text Props**:

| Prop            | Values                                                               | Purpose                |
| --------------- | -------------------------------------------------------------------- | ---------------------- |
| `size`          | -1, 0, 1, 2, 3, 4, 5, 6, 7, 8                                        | Font size scale        |
| `weight`        | `thin`, `light`, `normal`, `bold`                                    | Font weight            |
| `shade`         | `background`, `surface`, `accent`, `halftone`, `muted`, `foreground` | Text color             |
| `tone`          | `positive`, `critical`, `warning`, `info`                            | Semantic color         |
| `align`         | `left`, `center`, `right`, `justify`                                 | Text alignment         |
| `underline`     | `true`, `false`                                                      | Text decoration        |
| `strikethrough` | `true`                                                               | Strikethrough text     |
| `balance`       | `true`                                                               | CSS text-wrap: balance |

Text also supports all spacing props (`m`, `mb`, `p`, etc.).

#### Examples

**Before (CSS/Tailwind approach):**

```tsx
// Don't do this
<div className="flex flex-col gap-4 p-2">
  <span className="text-sm text-gray-500 font-bold mb-2">Title</span>
  <div className="flex gap-2 items-center">...</div>
</div>
```

**After (Component props approach):**

```tsx
// Do this instead
<Stack gap={4} p={2}>
  <Text size={0} shade="muted" weight="bold" mb={2}>
    Title
  </Text>
  <Group gap={2} ay="center">
    ...
  </Group>
</Stack>
```

**Timeline item example:**

```tsx
// Layout controlled by component props, not CSS
<Group gap={3} pb={4}>
  <TimelineDot />
  <TimelineConnector />
  <TimelineContent>
    <Text size={1} weight="bold">
      Event Title
    </Text>
    <Text size={0} shade="muted">
      2 hours ago
    </Text>
  </TimelineContent>
</Group>
```

#### When to Use CSS Modules

Only use CSS Modules for:

- **Visual styling** that can't be expressed as props (colors, borders, shadows, animations)
- **State-based styling** using `data-*` attributes
- **Pseudo-elements** (::before, ::after)
- **Complex positioning** (absolute, transforms)

```css
/* Good use of CSS - visual styling */
.timeline-dot {
  border-radius: 9999px;
  border: 2px solid var(--shade-foreground);
  background-color: var(--shade-background);
}

/* Good use of CSS - state styling */
.timeline-dot[data-status="pending"] {
  border-color: var(--globals-border-color);
}
```

### CSS Variable Naming

```css
--{layer}-{property}
--{layer}-{variant}-{property}
--{layer}-state-{state}-{property}
```

Examples:

```css
--forms-background
--forms-backgroundHover
--buttons-variant-primary-background
--forms-state-disabled-opacity
```

## Package Exports

Each package exports from `src/index.ts`:

```ts
// Components
export { Component } from "./component/component";

// Types
export type { ComponentProps } from "./component/component.types";
```

## Dependencies

### Internal Dependencies

Use workspace protocol for internal packages:

```json
{
  "dependencies": {
    "@uiid/utils": "workspace:*",
    "@uiid/tokens": "workspace:*"
  }
}
```

### External Dependencies

- **@base-ui/react** - Accessible UI primitives
- **react** / **react-dom** - Peer dependencies

## Common Tasks

### Creating a New Package

When creating a new `@uiid/*` package:

1. Create the package directory under `packages/`
2. Add `package.json`, `tsconfig.json`, and `vite.config.ts` (using `createViteConfig`)
3. Create `src/index.ts` barrel export
4. Add `src/vite-env.d.ts` for CSS module types
5. **Register in Storybook** - Add the stories path to `apps/storybook/.storybook/main.ts`:
   ```ts
   stories: [
     // ... existing packages
     "../../../packages/{new-package}/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
   ],
   ```
6. **Register in Vitest** - Add the package alias to `vitest.config.ts`:
   ```ts
   const uiidPackages = [
     // ... existing packages
     "{new-package}",
   ];
   ```
7. Run `pnpm install` to link the workspace package

### Creating a New Component

1. Create component directory with standard file structure
2. Implement component following the template pattern
3. Add types, constants, and styles
4. Write Storybook stories
5. Write unit tests
6. Create README using the template

### Adding Tests to an Existing Package

1. Create `{component}.test.tsx` file alongside the component
2. Run `pnpm test:run` from root to verify

### Converting External Components

When adapting components from external sources (shadcn, Radix patterns, etc.) to UIID conventions, follow this process:

#### 1. File Structure Setup

Create the standard file structure for the component:

```
{component}/
├── {component}.tsx           # Main component
├── {component}.types.ts      # All TypeScript types/interfaces
├── {component}.constants.ts  # Component name constants
├── {component}.context.ts    # React contexts and context hooks
├── {component}.hooks.ts      # Custom hooks
├── {component}.utils.ts      # Utility functions
├── {component}.variants.ts   # CVA variant definitions
├── {component}.module.css    # CSS styles
├── {component}.stories.tsx   # Storybook stories
└── subcomponents/            # If compound component
    ├── index.ts
    └── {subcomponent}.tsx
```

#### 2. Use Regular Components (Not Render Props)

Most components should use standard React elements, not the `renderWithProps` pattern:

**Before (Radix pattern):**

```tsx
import { Slot } from "@radix-ui/react-slot";

interface Props extends React.ComponentProps<"div"> {
  asChild?: boolean;
}

function Component({ asChild, ...props }: Props) {
  const Comp = asChild ? Slot : "div";
  return <Comp {...props} />;
}
```

**After (UIID pattern):**

```tsx
import { cx } from "@uiid/utils";

interface Props extends React.ComponentProps<"div"> {}

function Component({ className, children, ...props }: Props) {
  return (
    <div
      data-slot="component"
      className={cx(styles["component"], className)}
      {...props}
    >
      {children}
    </div>
  );
}
```

**When to use `renderWithProps`:**

Only use `renderWithProps` for **low-level primitives** where polymorphism is essential:

- `Box` - needs to render as any element
- `Text` - needs to render as p, span, h1-h6, etc.
- Layout primitives that wrap other components

For compound components like Timeline, Sortable, or domain-specific components, use regular elements.

#### 3. Convert Tailwind/CVA to CSS Modules

**Step 1:** Extract Tailwind classes from inline CVA definitions

**Step 2:** Create `{component}.module.css` with equivalent CSS:

```css
/* Use design tokens instead of arbitrary values */
.component {
  display: flex;
  gap: 0.75rem; /* or var(--spacing-3) if token exists */
}

/* Use data attributes for state */
.component[data-disabled] {
  opacity: var(--globals-disabled-opacity);
}

/* Use nested selectors for variants */
.component.orientation-vertical {
  flex-direction: column;
}
```

**Step 3:** Create `{component}.variants.ts` using CSS module classes:

```ts
import { cva } from "@uiid/utils";
import styles from "./component.module.css";

export const componentVariants = cva({
  base: styles["component"],
  variants: {
    orientation: {
      vertical: styles["orientation-vertical"],
      horizontal: styles["orientation-horizontal"],
    },
    size: {
      small: styles["size-small"],
      medium: styles["size-medium"],
    },
  },
  defaultVariants: {
    orientation: "vertical",
    size: "medium",
  },
});
```

#### 4. Separate Concerns

| Content                                             | File                       |
| --------------------------------------------------- | -------------------------- |
| Component name constants (`ROOT_NAME`, `ITEM_NAME`) | `{component}.constants.ts` |
| All TypeScript types and interfaces                 | `{component}.types.ts`     |
| React contexts and `use{X}Context` hooks            | `{component}.context.ts`   |
| Custom hooks (`useStore`, `useLazyRef`, etc.)       | `{component}.hooks.ts`     |
| Pure utility functions                              | `{component}.utils.ts`     |
| CVA variant definitions                             | `{component}.variants.ts`  |

#### 5. Handle Name Conflicts

When exporting types, ensure names don't conflict with existing exports in the package:

```ts
// Instead of generic names that may conflict:
export type Status = "active" | "pending";

// Use component-prefixed names:
export type TimelineStatus = "active" | "pending";
```

#### 6. Remove Unnecessary Dependencies

Check if external dependencies can be replaced:

| External                    | UIID Alternative                                        |
| --------------------------- | ------------------------------------------------------- |
| `@radix-ui/react-slot`      | `renderWithProps` from `@uiid/utils`                    |
| `@radix-ui/react-direction` | `useDirection` from `@base-ui/react/direction-provider` |
| `class-variance-authority`  | `cva` from `@uiid/utils` (pre-configured)               |
| `clsx` / `tailwind-merge`   | `cx` from `@uiid/utils`                                 |

**Direction handling example:**

```tsx
import { useDirection } from "@base-ui/react/direction-provider";

function Component({ dir: dirProp, ...props }) {
  const direction = useDirection();
  const dir = dirProp ?? direction ?? "ltr";
  // ...
}
```

#### 7. Update Package Exports

Add to `src/index.ts`:

```ts
export * from "./{component}/{component}";
export * from "./{component}/{component}.types";
export * from "./{component}/subcomponents"; // if applicable
```

#### 8. Verification Checklist

- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm build --filter=@uiid/{package}` succeeds
- [ ] No name conflicts with existing exports
- [ ] Low-level primitives (Box, Text) use `renderWithProps`; all other components use regular elements
- [ ] CSS uses design tokens where available
- [ ] Stories demonstrate all variants
- [ ] `data-slot` attributes on all elements

## Quick Reference

| Task                 | Command                                   |
| -------------------- | ----------------------------------------- |
| Install dependencies | `pnpm install`                            |
| Build all packages   | `pnpm run build`                          |
| Build single package | `pnpm run build --filter=@uiid/{package}` |
| Run tests            | `pnpm test:run`                           |
| Run tests (watch)    | `pnpm test`                               |
| Start Storybook      | `pnpm run storybook`                      |
| Lint                 | `pnpm run lint`                           |
| Format               | `pnpm run format`                         |

## Public Release Roadmap

This section tracks the system-level improvements needed to prepare UIID for public release. These are long-term goals that should be addressed incrementally.

### 1. Package Publishing Setup

- [ ] Configure npm registry settings
- [ ] Audit `package.json` fields across all packages (`main`, `module`, `exports`, `types`, `sideEffects`)
- [ ] Establish versioning strategy (independent vs. fixed)
- [ ] Set up changesets for version management
- [ ] Configure `publishConfig` for public access

### 2. Documentation

- [ ] Create comprehensive root README with installation, quick start, and package overview
- [ ] Write CONTRIBUTING.md guide
- [ ] Set up automated changelog generation
- [ ] Document design token system
- [ ] Add architecture decision records (ADRs) for major decisions

### 3. CI/CD Pipeline

- [ ] GitHub Actions workflow for running tests on PRs
- [ ] GitHub Actions workflow for building all packages
- [ ] Automated publishing workflow (on release tags or changesets)
- [ ] Storybook deployment (GitHub Pages or similar)
- [ ] Bundle size tracking

### 4. Quality Gates

- [ ] Establish test coverage thresholds per package
- [ ] Configure stricter lint rules for production
- [ ] Set up pre-commit hooks (husky + lint-staged)
- [ ] Add TypeScript strict mode compliance checks
- [ ] Bundle analysis and size limits

### 5. Licensing & Legal

- [x] Add MIT license (completed)
- [ ] Add license headers to source files (if required)
- [ ] Audit dependencies for license compatibility
- [ ] Add NOTICE file if needed for attribution

### 6. Bundle & Export Validation

- [ ] Verify ESM/CJS compatibility
- [ ] Test package exports in consumer applications
- [ ] Validate TypeScript declarations
- [ ] Ensure CSS is properly externalized
- [ ] Test tree-shaking effectiveness

### Progress Tracking

When working on these items, update the checkboxes above and note any decisions or blockers encountered. Each area can be tackled independently, but some have dependencies (e.g., CI/CD should come after tests are comprehensive).
