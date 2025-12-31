import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Progress } from "./progress";

const meta = {
  title: "Indicators/Progress",
  component: Progress,
  tags: ["danger"],
  args: {
    value: 15,
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={8}>
      <Progress {...args} />
    </Stack>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Progress" };
