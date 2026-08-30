# UIID

A modular React component library built with React 19, TypeScript, and [Base UI](https://base-ui.com/). Components are styled with CSS Modules and design tokens, and ship as independent packages — install only what you need.

## Installation

```bash
pnpm add @uiid/design-system
```

```tsx
import { Button, Stack } from "@uiid/design-system";
import "@uiid/design-system/globals.css";

function App() {
  return (
    <Stack gap={4}>
      <Button>Save changes</Button>
      <Button variant="subtle">Cancel</Button>
    </Stack>
  );
}
```

Every component also ships as an individual package (`@uiid/buttons`, `@uiid/layout`, …) if you'd rather install only what you use — pair them with `@uiid/tokens` for the global styles.

## Packages

### Components

- `@uiid/buttons` — Button, CloseButton, CopyButton, ToggleButton
- `@uiid/calendars` — Date and date range pickers
- `@uiid/cards` — Card components
- `@uiid/code` — Code blocks, inline code, and syntax highlighting
- `@uiid/forms` — Input, Select, Checkbox, Radio, Switch, Slider, and more
- `@uiid/indicators` — Avatar, Badge, Progress, Status, Timeline
- `@uiid/interactive` — Collapsible, Resizable, Sortable, ToggleGroup
- `@uiid/layout` — Box, Stack, Group, Layer, Separator
- `@uiid/lists` — List components
- `@uiid/navigation` — Accordion, Breadcrumbs, Menu, Pagination, Tabs
- `@uiid/overlays` — Dialog, Drawer, Popover, Tooltip
- `@uiid/tables` — Table components
- `@uiid/typography` — Text and Prose

### Foundation

- `@uiid/tokens` — Design tokens (JSON → CSS custom properties)
- `@uiid/icons` — Icon components (Lucide)
- `@uiid/utils` — Shared utilities (`cx`, `cva`, render props, style props)
- `@uiid/design-system` — Everything above in a single package

## Development

```bash
pnpm install
pnpm run dev           # Start all packages in dev mode
pnpm run build         # Build all packages
pnpm run lint          # Lint all packages
pnpm test:run          # Run tests
pnpm run storybook     # Component workshop at localhost:6006
```

Bundle sizes are budgeted with [size-limit](https://github.com/ai/size-limit) — `pnpm size` checks every package against `.size-limit.json`.

## Architecture

- **Monorepo** — pnpm workspaces + Turbo
- **Build** — Vite 7
- **Styling** — CSS Modules with design tokens
- **Primitives** — Base UI for accessible behavior
- **Testing** — Vitest + Testing Library

## License

MIT
