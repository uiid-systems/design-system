# Storybook Stories

See the full template at `.claude/templates/COMPONENT_STORY.md`.

## Guidelines

1. **Group variations in a single story** — keep all component variations (sizes, states, variants) together in one story using the render function.
2. **Use Stack for layout** — wrap multiple examples in `<Stack>` for consistent vertical spacing.
3. **One story per component** — each component should have a single "Default" story. Only create additional stories for genuinely complex experiences (multi-step flows, interactive demos with state).
4. **Prefer simple components** — demonstrate the simple component API. Only show composed subcomponent usage if it's the only way to achieve a specific pattern.
5. **Use argTypes for controls** — expose key props grouped by category (Toggles, Options, Text, Subcomponents).

## Template

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Component } from "./component";

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
