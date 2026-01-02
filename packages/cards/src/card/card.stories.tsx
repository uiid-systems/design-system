import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack, Group } from "@uiid/layout";

import { Card } from "./card";

const meta = {
  title: "Cards/Card",
  component: Card,
  args: {
    title: "Card Title",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  render: (args) => (
    <Group gap={2} evenly>
      <Stack gap={4}>
        <Card {...args} size="xsmall" title="Extra small card" />
        <Card {...args} size="small" title="Small card" />
        <Card {...args} size="medium" title="Medium card" />
        <Card {...args} size="large" title="Large card" />
      </Stack>

      <Stack gap={4}>
        <Card {...args} variant="info" title="Info card" />
        <Card {...args} variant="warning" title="Warning card" />
        <Card {...args} variant="negative" title="Negative card" />
        <Card {...args} variant="positive" title="Positive card" />
        <Card {...args} variant="inverted" title="Inverted card" />
      </Stack>
    </Group>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Card" };
