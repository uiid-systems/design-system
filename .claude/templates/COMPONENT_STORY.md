# Story Template

Use this template when creating Storybook stories for components.

## Template

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Component } from "./component";

const meta = {
  title: "Category/Component",
  component: Component,
  tags: ["beta"], // Remove when stable
  args: {
    // Default prop values
  },
  argTypes: {
    // Group controls by category
    disabled: { control: "boolean", table: { category: "Toggles" } },

    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Options" },
    },

    label: { control: "text", table: { category: "Text" } },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack gap={4}>
      {/* Show all variations in a single render */}
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

## Guidelines

### One Story Per Component

Keep all variations grouped in the default story's render function. This provides a complete view of the component's API at a glance.

**Do:**
```tsx
render: (args) => (
  <Stack gap={4}>
    <Button {...args}>Default</Button>
    <Button {...args} variant="secondary">Secondary</Button>
    <Button {...args} size="small">Small</Button>
  </Stack>
),
```

**Don't:**
```tsx
// Avoid creating separate stories for simple variations
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "small" } };
```

### When to Create Additional Stories

Only create separate stories for:

- **Complex interactive demos** - Multi-step flows, forms with validation
- **Stateful examples** - Controlled components with useState
- **Integration examples** - Component combinations that need explanation

### ArgTypes Categories

Group controls consistently:

| Category | Props |
|----------|-------|
| Toggles | `disabled`, `required`, `bordered`, `reversed` |
| Options | `size`, `variant`, `orientation`, `direction` |
| Text | `label`, `description`, `placeholder` |
| Subcomponents | `RootProps`, `ThumbProps`, `FieldProps` |

### Prefer Simple Components

Stories should demonstrate the simple component API, not composed subcomponents:

**Do:**
```tsx
<Slider defaultValue={50} label="Volume" />
```

**Don't:**
```tsx
<SliderRoot defaultValue={50}>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb />
    </SliderTrack>
  </SliderControl>
</SliderRoot>
```

Only show composed usage if it's the only way to achieve a pattern (and consider adding the feature to the simple component instead).

### New Package Registration

When creating stories for a **new package**, you must register it in the Storybook config:

**`apps/storybook/.storybook/main.ts`**
```ts
const config: StorybookConfig = {
  stories: [
    // ... existing packages
    "../../../packages/{new-package}/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  // ...
};
```

Stories won't appear in Storybook until this path is added.
