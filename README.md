# The UIID Design System

A modern, modular React component library built with TypeScript, Vite, and Base UI. Designed for performance, accessibility, and developer experience.

## 📦 Packages

This monorepo contains the following packages:

### Component Libraries

- **`@uiid/buttons`** - Button components (Button, CloseButton, CopyButton, ToggleButton)
- **`@uiid/calendars`** - Date and date range pickers with filtering
- **`@uiid/cards`** - Card components for content containers
- **`@uiid/forms`** - Form controls (Input, Select, Checkbox, Radio, etc.)
- **`@uiid/indicators`** - Status indicators (Alert, Avatar, Badge, Progress)
- **`@uiid/interactive`** - Interactive components (Tabs, ToggleGroup)
- **`@uiid/layout`** - Layout primitives (Stack, Group, Container, Grid)
- **`@uiid/overlays`** - Modal dialogs, drawers, and tooltips
- **`@uiid/typography`** - Text and heading components

### Foundation

- **`@uiid/tokens`** - Design tokens (colors, spacing, typography)
- **`@uiid/icons`** - Icon components
- **`@uiid/utils`** - Shared utilities and helpers

## 🚀 Quick Start

### Installation

```bash
# Install dependencies (automatically installs Playwright browsers)
pnpm install

# Build all packages
pnpm run build

# Start Storybook
pnpm run storybook
```

> **Note:** The `postinstall` script automatically installs Chromium for Storybook testing. If you need other browsers, run `pnpm exec playwright install`.

### Using Components

```tsx
import { Button } from "@uiid/buttons";
import { DateCalendar } from "@uiid/calendars";
import "@uiid/buttons/globals.css";
import "@uiid/calendars/globals.css";

function App() {
  return (
    <>
      <Button variant="primary">Click me</Button>
      <DateCalendar onSelect={(date) => console.log(date)} />
    </>
  );
}
```

## 🛠️ Development

### Available Scripts

```bash
pnpm run dev           # Start all packages in dev mode
pnpm run build         # Build all packages
pnpm run lint          # Lint all packages
pnpm run format        # Format code with Prettier
pnpm run test          # Run tests
pnpm run storybook     # Start Storybook dev server
```

### Building a Single Package

```bash
pnpm run build --filter=@uiid/buttons
```

## 🏗️ Architecture

- **Monorepo**: Managed with pnpm workspaces and Turbo
- **Build**: Vite for fast, optimized builds
- **Styling**: CSS Modules with design tokens
- **Base**: Built on [@base-ui-components](https://base-ui.com/) for accessibility
- **Type Safety**: Full TypeScript support

## 📖 Documentation

Visit [Storybook](http://localhost:6006) for component documentation and interactive examples.

## 🔧 Tech Stack

- React 19
- TypeScript 5.8
- Vite 7
- pnpm
- Turbo
- Storybook
- Vitest

## 📝 License

Private package - All rights reserved.
