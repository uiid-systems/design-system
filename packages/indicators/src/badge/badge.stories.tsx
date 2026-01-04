import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Badge } from "./badge";

const meta = {
  title: "Indicators/Badge",
  component: Badge,
  tags: ["beta"],
  args: {},
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },
    hideIndicator: {
      control: "boolean",
      table: { category: "Toggles" },
    },
  },
  render: (args) => (
    <Stack gap={4}>
      <Badge {...args}>Badge</Badge>
      <Badge {...args} tone="positive">
        Positive
      </Badge>
      <Badge {...args} tone="negative">
        Negative
      </Badge>
      <Badge {...args} tone="info">
        Info
      </Badge>
      <Badge {...args} tone="warning">
        Warning
      </Badge>
    </Stack>
  ),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Badge" };
