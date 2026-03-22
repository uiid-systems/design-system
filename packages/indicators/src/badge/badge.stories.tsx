import type { Meta, StoryObj } from "@storybook/react-vite";

import { Group, Stack } from "@uiid/layout";

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
    color: {
      control: "select",
      options: [
        undefined,
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "purple",
      ],
      table: { category: "Variants" },
    },
  },
  render: (args) => (
    <Stack gap={4}>
      <Badge {...args}>Badge</Badge>
      <Badge {...args} inverted>
        Inverted
      </Badge>
    </Stack>
  ),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Badge" };

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
] as const;

export const Colors: Story = {
  render: (args) => (
    <Group gap={2}>
      {colors.map((color) => (
        <Badge key={color} {...args} color={color}>
          {color}
        </Badge>
      ))}
    </Group>
  ),
};
