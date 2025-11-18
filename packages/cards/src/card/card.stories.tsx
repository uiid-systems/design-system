import type { Meta, StoryObj } from "@storybook/react-vite";
import { X } from "@uiid/icons";
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
        <Card {...args} size="xs" title="Extra small card" />
        <Card {...args} size="sm" title="Small card" />
        <Card {...args} size="md" title="Medium card" />
        <Card {...args} size="lg" title="Large card" />
      </Stack>

      <Stack gap={4}>
        <Card {...args} variant="info" title="Info card" />
        <Card {...args} variant="warning" title="Warning card" />
        <Card {...args} variant="error" title="Error card" />
        <Card {...args} variant="success" title="Success card" />
        <Card {...args} variant="inverted" title="Inverted card" />
      </Stack>

      <Stack gap={4} ax="stretch">
        <Card
          {...args}
          title="Card with action"
          action={{
            icon: <X />,
            "aria-label": "Card action",
            onClick: () => alert("Card action clicked"),
          }}
        />
      </Stack>
    </Group>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Card" };
