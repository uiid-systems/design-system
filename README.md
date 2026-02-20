# The UIID Design System

A modern, modular React component library built with React 19, TypeScript 5.8, Vite 7, and Base UI. Designed for performance, accessibility, and developer experience.

## Packages

This monorepo contains the following packages:

### Component Libraries

- **`@uiid/buttons`** - Button components (Button, CloseButton, CopyButton, ToggleButton)
- **`@uiid/calendars`** - Date and date range pickers with filtering
- **`@uiid/cards`** - Card components for content containers
- **`@uiid/code`** - Code display components
- **`@uiid/forms`** - Form controls (Input, Select, Checkbox, Radio, Switch, etc.)
- **`@uiid/indicators`** - Status indicators (Alert, Avatar, Badge, Progress, etc.)
- **`@uiid/interactive`** - Interactive components (Tabs, ToggleGroup)
- **`@uiid/layout`** - Layout primitives (Stack, Group, Box, Container, Grid, Separator)
- **`@uiid/lists`** - List components
- **`@uiid/navigation`** - Navigation components
- **`@uiid/overlays`** - Modal dialogs, drawers, and tooltips
- **`@uiid/tables`** - Table components
- **`@uiid/typography`** - Text and heading components

### Foundation

- **`@uiid/tokens`** - Design tokens (colors, spacing, typography)
- **`@uiid/icons`** - Icon components
- **`@uiid/utils`** - Shared utilities and helpers (cx, cva, renderWithProps)

### Tooling

- **`@uiid/registry`** - Component metadata and Zod schemas for AI-powered tools
- **`@uiid/blocks`** - Prebuilt UI block compositions

### Apps

- **`apps/playground`** - AI-powered UI generator (see `apps/playground/AGENTS.md`)
- **`apps/storybook`** - Component documentation and visual testing
- **`apps/docs`** - Documentation site

## Quick Start

### Installation

```bash
pnpm install
pnpm run build
pnpm run storybook
```

### Using Components

```tsx
import { Button } from "@uiid/buttons";
import { Stack } from "@uiid/layout";
import "@uiid/tokens/globals.css";
import "@uiid/buttons/globals.css";

function App() {
  return (
    <Stack gap={4}>
      <Button variant="primary">Click me</Button>
      <Button variant="secondary">Cancel</Button>
    </Stack>
  );
}
```

## Development

### Available Scripts

```bash
pnpm run dev           # Start all packages in dev mode
pnpm run build         # Build all packages
pnpm run lint          # Lint all packages
pnpm run format        # Format code with Prettier
pnpm test:run          # Run tests
pnpm test              # Run tests in watch mode
pnpm run storybook     # Start Storybook dev server
```

### Building a Single Package

```bash
pnpm run build --filter=@uiid/buttons
```

### Running Tests for a Package

```bash
pnpm test:run packages/buttons
```

## Architecture

- **Monorepo**: pnpm workspaces + Turbo
- **Build**: Vite 7
- **Styling**: CSS Modules with design tokens
- **Primitives**: Built on [Base UI](https://base-ui.com/) for accessibility
- **Testing**: Vitest with Testing Library
- **Docs**: Storybook

## Documentation

Visit [Storybook](http://localhost:6006) after running `pnpm run storybook` for component documentation and interactive examples.

For AI agent guidelines, see [AGENTS.md](./AGENTS.md).

## License

MIT
