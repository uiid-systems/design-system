import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { ActionCard } from "./action-card";

const meta = {
  title: "Cards/Action Card",
  component: ActionCard,
  tags: ["beta"],
  args: {
    title: "Action Card",
    children: "It's a card, but it's also a button.",
  },
  argTypes: {
    onClick: { action: "onClick" },
  },
  render: (args) => (
    <Stack gap={4}>
      <ActionCard {...args} />
    </Stack>
  ),
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Action Card" };
