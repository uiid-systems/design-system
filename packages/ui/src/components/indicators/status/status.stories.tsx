import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/primitives";

import { Status } from "./status";

const meta = {
  title: "Indicators/Status",
  component: Status,
  args: {},
  render: (args) => (
    <Stack gap={4}>
      <Status {...args}>Status</Status>
      <Status {...args} pulse>
        Pulsing status
      </Status>
    </Stack>
  ),
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Status" };
