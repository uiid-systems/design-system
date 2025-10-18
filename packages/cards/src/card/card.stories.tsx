import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Card } from "./card";

const meta = {
  title: "Cards/Card",
  component: Card,
  args: {
    title: "Card Title",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    style: {
      maxWidth: "640px",
    },
  },
  argTypes: {
    onDismiss: { action: "dismissed" },
    onSubmit: { action: "submitted" },
    onCancel: { action: "canceled" },
  },
  render: (args) => (
    <Stack gap={4}>
      <Card {...args} size="sm" />
      <Card {...args} size="md" />
      <Card {...args} size="lg" />
      <Card {...args} variant="info" />
      <Card {...args} variant="warning" />
      <Card {...args} variant="error" />
      <Card {...args} variant="success" />
      <Card {...args} variant="inverted" />
    </Stack>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Card" };
