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

## Root Configuration Files

Shared tooling configs live at the repository root:

| File               | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `vite.config.ts`   | Shared Vite build config factory             |
| `vitest.config.ts` | Test configuration for all packages          |
| `vitest.setup.ts`  | Test setup (jest-dom matchers)               |
| `tsconfig.json`    | Base TypeScript config (packages extend it)  |
| `turbo.json`       | Turbo task orchestration                     |
| `eslint.config.js` | Shared ESLint configuration                  |

### Vite Configuration

The root `vite.config.ts` exports a `createViteConfig()` factory function. Packages import and use it:

```ts
import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: ["@base-ui/react"],  // Additional externals
  cssLayer: "uiid.components",   // Optional CSS layer wrapping
  preserveDirectives: false,     // Default: true
});
```

**Options:**
- `external` - Additional dependencies to exclude from bundle (React and @uiid/* are always external)
- `cssLayer` - CSS layer name for postcss wrapper (e.g., "uiid.components")
- `preserveDirectives` - Whether to preserve "use client" directives (default: true)

**Special cases:** `icons` and `utils` packages have custom configs due to unique requirements.

## Scripts Directory

The `scripts/` directory contains **custom build scripts** specific to this project:

| Script                              | Purpose                                    |
| ----------------------------------- | ------------------------------------------ |
| `generate-tokens.cjs`               | Converts JSON design tokens to CSS         |
| `postcss-layer-wrapper.cjs`         | PostCSS plugin for CSS layer scoping       |
| `vite-plugin-preserve-directives.mjs` | Vite plugin to preserve "use client"     |
| `build-changelog.mjs`               | Generates changelog from changesets        |
| `auto-changeset.mjs`                | Automates changeset creation               |

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

import { SomeBase } from "@base-ui-components/react/some-base";
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

1. **Expose common props directly** - Don't require users to pass frequently-used props through nested prop objects (e.g., `RootProps`). Instead, extend the underlying component's props type and spread them to the root element.

2. **Keep nested prop objects for overrides** - Maintain `RootProps`, `ThumbProps`, etc. for cases where users need to pass additional or overriding props to specific subcomponents.

3. **Export all subcomponents** - Allow consumers to compose the component themselves if they need full control.

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

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Component } from "./component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByRole("...")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    render(<Component />);
    // Test interactions
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

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Component } from "./component";

const meta = {
  title: "Category/Component",
  component: Component,
  args: {
    // Default args
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Component",
};
```

## Styling

### CSS Modules

- Use CSS Modules (`.module.css`) for component styles
- Reference design tokens via CSS custom properties
- Use `data-*` attributes for state-based styling

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

- **@base-ui-components/react** - Accessible UI primitives
- **react** / **react-dom** - Peer dependencies

## Common Tasks

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
