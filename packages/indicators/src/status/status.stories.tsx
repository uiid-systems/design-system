import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Status } from "./status";

const meta = {
  title: "Indicators/Status",
  component: Status,
  tags: ["beta"],
  args: {},
  argTypes: {
    tone: {
      control: "select",
      options: ["positive", "warning", "critical", "info"],
      table: { category: "Variants" },
    },
    pulse: { control: "boolean", table: { category: "Toggles" } },
  },
  render: (args) => (
    <Stack gap={4}>
      <Status {...args} />
      <Status {...args}>with label</Status>
      <Status {...args} pulse>
        pulsing
      </Status>
      <Status {...args} tone="positive">
        positive
      </Status>
      <Status {...args} tone="warning">
        warning
      </Status>
      <Status {...args} tone="critical">
        critical
      </Status>
      <Status {...args} tone="info">
        info
      </Status>
      <Status {...args} inverted>
        inverted
      </Status>
    </Stack>
  ),
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Status" };
