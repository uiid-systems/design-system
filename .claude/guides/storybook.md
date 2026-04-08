# Storybook Stories

See the full template at `.claude/templates/COMPONENT_STORY.md`.

## Story Location

All stories live in `apps/storybook/stories/`, organized by package category:

```
apps/storybook/stories/
├── buttons/          # Button, ToggleButton
├── calendars/        # DatePicker, DateRangePicker, EventCalendar
├── cards/            # Card, ActionCard
├── code/             # CodeBlock, CodeEditor, CodeInline
├── forms/            # Input, Select, Checkbox, etc.
├── indicators/       # Badge, Alert, Avatar, Status, etc.
├── interactive/      # Accordion, Tabs, Menu, etc.
├── layout/           # Box, Stack, Group, Layer, etc.
├── lists/            # List
├── navigation/       # Breadcrumbs, Pagination, Sidebar
├── overlays/         # Modal, Drawer, Popover, etc.
├── tables/           # Table
├── tokens/           # Token documentation stories
└── typography/       # Text
```

Stories are **not** colocated with components — they live in the storybook app to enable free cross-component composition.

## Import Conventions

Import components from `@uiid/design-system`, icons from `@uiid/icons`:

```tsx
import { Button, Stack, Text } from "@uiid/design-system";
import { GlobeIcon } from "@uiid/icons";
```

For token stories, JSON files use the `@tokens` alias:

```tsx
import buttonTokens from "@tokens/json/component/button.tokens.json";
```

## Guidelines

1. **Group variations in a single story** — keep all component variations (sizes, states, variants) together in one story using the render function.
2. **Use Stack for layout** — wrap multiple examples in `<Stack>` for consistent vertical spacing.
3. **One story per component** — each component should have a single "Default" story. Only create additional stories for genuinely complex experiences (multi-step flows, interactive demos with state).
4. **Prefer simple components** — demonstrate the simple component API. Only show composed subcomponent usage if it's the only way to achieve a specific pattern.
5. **Use argTypes for controls** — expose key props grouped by category (Toggles, Options, Text, Subcomponents).
6. **Compose freely** — stories can use any component from the design system. This is the main advantage of centralizing stories.

## Template

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Component, Stack } from "@uiid/design-system";

const meta = {
  title: "Category/Component",
  component: Component,
  args: {},
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

## Running Storybook

```bash
pnpm run storybook
```
