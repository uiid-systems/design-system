# UIID

A modular React component library built with React 19, TypeScript, and [Base UI](https://base-ui.com/). Components are styled with CSS Modules and Style Dictionary. Library ships as one consolidated, tree-shakeable package or independent packages.
## Installation

```bash
pnpm add @uiid/design-system
```

```tsx
import { Button, Group, Input, Stack, Text } from "@uiid/design-system";
import "@uiid/design-system/globals.css";

export default function App() {
  return (
    <Stack gap={4}>
      <Text render={<h1 />} size={2}>
        Enter your name:
      </Text>
      <Input label="name" />
      <Group gap={2}>
        <Button variant="subtle">Cancel</Button>
        <Button>Save changes</Button>
      </Group>
    </Stack>
  );
}
```

## Packages

### Bundled

- `@uiid/design-system` — Everything below in a single package

### Components

- `@uiid/buttons` — Button, ToggleButton
- `@uiid/cards` — Card components
- `@uiid/code` — Code blocks, inline code, and syntax highlighting
- `@uiid/forms` — Input, Select, Checkbox, Radio, Switch, Slider, ToggleGroup, and more
- `@uiid/indicators` — Avatar, Badge, Progress, Status, Timeline
- `@uiid/interactive` — Collapsible, Resizable, Sortable
- `@uiid/layout` — Box, Stack, Group, Layer, Separator, utility wrappers
- `@uiid/lists` — List components
- `@uiid/navigation` — Accordion, Breadcrumbs, Menu, Pagination, Tabs
- `@uiid/overlays` — Dialog, Drawer, Popover, Toast, Tooltip
- `@uiid/tables` — Table components
- `@uiid/typography` — Text, Prose, animations

### Foundation

- `@uiid/tokens` — Design tokens (JSON → CSS custom properties)
- `@uiid/icons` — Icon components (Lucide)
- `@uiid/utils` — Shared utilities (`cx`, `cva`, render props, style props)

## Development

```bash
pnpm install
pnpm run dev           # Start all packages in dev mode
pnpm run build         # Build all packages
pnpm run lint          # Lint all packages
pnpm test:run          # Run tests
```

Bundle sizes are budgeted with [size-limit](https://github.com/ai/size-limit) — `pnpm size` checks every package against `.size-limit.json`.

## Architecture

- **Monorepo** — pnpm workspaces + Turbo
- **Build** — Vite 7
- **Styling** — CSS Modules, Style Dictionary
- **Primitives** — Base UI
- **Testing** — Vitest + Testing Library

## License

MIT
