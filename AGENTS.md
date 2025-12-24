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
├── scripts/                 # Build and utility scripts
├── templates/               # Templates for documentation and code
└── AGENTS.md                # This file
```

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

## Testing

### Test Setup

Each package has Vitest configured with:

- `vitest.config.ts` - Vitest configuration
- `vitest.setup.ts` - Test setup with jest-dom matchers

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
# Run tests for a specific package
cd packages/{package-name}
pnpm test

# Watch mode
pnpm test:watch
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

1. Ensure `vitest.config.ts` and `vitest.setup.ts` exist
2. Verify `tsconfig.json` includes vitest types
3. Create `{component}.test.tsx` file
4. Run `pnpm test` to verify

## Quick Reference

| Task                 | Command                                   |
| -------------------- | ----------------------------------------- |
| Install dependencies | `pnpm install`                            |
| Build all packages   | `pnpm run build`                          |
| Build single package | `pnpm run build --filter=@uiid/{package}` |
| Run tests            | `pnpm run test`                           |
| Start Storybook      | `pnpm run storybook`                      |
| Lint                 | `pnpm run lint`                           |
| Format               | `pnpm run format`                         |
