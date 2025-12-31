import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Status } from "./status";

const meta = {
  title: "Indicators/Status",
  component: Status,
  tags: ["beta"],
  args: {},
  render: (args) => (
    <Stack gap={4}>
      <Status {...args}>Status</Status>
      <Status {...args} pulse>
        Pulsing status
      </Status>
      <Status {...args} variant="positive">
        Success
      </Status>
      <Status {...args} variant="warning">
        Warning
      </Status>
      <Status {...args} variant="negative">
        Error
      </Status>
      <Status {...args} variant="info">
        Info
      </Status>
      <Status variant="positive" pulse />
    </Stack>
  ),
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Status" };
