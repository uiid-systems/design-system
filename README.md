# UIID Design System

A registry-first design system built with React 19, TypeScript, and Base UI. Components are the implementation. The registry is the interface.

For the full vision and architectural decisions, see [`docs/VISION.md`](./docs/VISION.md).

---

## Three Layers

### Tokens

Platform-aligned design values — color, spacing, typography — defined as structured data and compiled to CSS custom properties. The source format is W3C Design Tokens spec-aligned JSON, making it adaptable without changing the source.

### Registry

A machine-readable description of every component: props, types, defaults, slots, and usage guidance. The registry is what keeps documentation accurate, gives LLMs correct knowledge of the system, and powers the blocks app. It's also what an MCP server exposes to external tools.

### Blocks

Named UI compositions — login forms, settings panels, pricing cards — built from registry-validated components. Blocks prevent the composition drift that happens when the same patterns get assembled independently across products and teams.

---

## Packages

### Component Libraries

- **`@uiid/buttons`** — Button, CloseButton, CopyButton, ToggleButton
- **`@uiid/calendars`** — Date and date range pickers
- **`@uiid/cards`** — Card components
- **`@uiid/code`** — Code display
- **`@uiid/forms`** — Input, Select, Checkbox, Radio, Switch, Slider, and more
- **`@uiid/indicators`** — Alert, Avatar, Badge, Progress, Status, Timeline
- **`@uiid/interactive`** — Accordion, Collapsible, Tabs, ToggleGroup
- **`@uiid/layout`** — Stack, Group, Box, Container, Separator
- **`@uiid/lists`** — List components
- **`@uiid/navigation`** — Navigation components
- **`@uiid/overlays`** — Modal, Drawer, Sheet, Popover, Tooltip
- **`@uiid/tables`** — Table components
- **`@uiid/typography`** — Text and heading components

### Foundation

- **`@uiid/tokens`** — Design tokens (JSON → CSS)
- **`@uiid/icons`** — Icon components (Lucide)
- **`@uiid/utils`** — Shared utilities (`cx`, `cva`, `renderWithProps`)

### System

- **`@uiid/registry`** — Component metadata and Zod schemas
- **`@uiid/blocks`** — Prebuilt UI block compositions

### Apps

- **`apps/blocks`** — AI-powered UI composer
- **`apps/storybook`** — Component documentation and visual testing
- **`apps/docs`** — Documentation site

---

## Getting Started

### Just the components

```bash
pnpm add @uiid/buttons @uiid/layout @uiid/tokens
```

```tsx
import { Button } from "@uiid/buttons";
import { Stack } from "@uiid/layout";
import "@uiid/tokens/globals.css";

function App() {
  return (
    <Stack gap={4}>
      <Button>Save changes</Button>
      <Button variant="subtle">Cancel</Button>
    </Stack>
  );
}
```

### The full system

```bash
pnpm install
pnpm run build
pnpm run storybook   # Component docs at localhost:6006
```

---

## Development

```bash
pnpm run dev           # Start all packages in dev mode
pnpm run build         # Build all packages
pnpm run lint          # Lint all packages
pnpm test:run          # Run tests
pnpm test              # Run tests in watch mode
pnpm run storybook     # Start Storybook
```

Build a single package:

```bash
pnpm run build --filter=@uiid/buttons
```

---

## Architecture

- **Monorepo**: pnpm workspaces + Turbo
- **Build**: Vite 7
- **Styling**: CSS Modules with design tokens
- **Primitives**: [Base UI](https://base-ui.com/) for accessible components
- **Testing**: Vitest + Testing Library
- **AI context**: CLAUDE.md at root and app level

## License

MIT
