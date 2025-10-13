import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../stack/stack";

import { Card } from "./card";

const meta = {
  title: "Primitives/Layout/Card",
  component: Card,
  args: {},
  render: (args) => (
    <Stack gap={4}>
      <Card {...args} size="sm">
        lorem ipsum dolor sit amet
      </Card>
      <Card {...args} size="md">
        lorem ipsum dolor sit amet
      </Card>
      <Card {...args} size="lg">
        lorem ipsum dolor sit amet
      </Card>
    </Stack>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Card" };
