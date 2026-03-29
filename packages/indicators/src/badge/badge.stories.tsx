import type { Meta, StoryObj } from "@storybook/react-vite";

import { Group } from "@uiid/layout";

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
        "neutral",
      ],
      table: { category: "Variants" },
    },
  },
  render: (args) => <Badge {...args}>Badge</Badge>,
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
  "neutral",
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
