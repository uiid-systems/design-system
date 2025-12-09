import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Badge } from "./badge";

const meta = {
  title: "Indicators/Badge",
  component: Badge,
  args: {},
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  render: (args) => (
    <Stack gap={4}>
      <Badge {...args}>Badge</Badge>
      <Badge {...args} variant="positive">
        Positive
      </Badge>
      <Badge {...args} variant="negative">
        Negative
      </Badge>
      <Badge {...args} variant="info">
        Info
      </Badge>
      <Badge {...args} variant="warning">
        Warning
      </Badge>
      <Badge {...args} variant="inverted">
        Inverted
      </Badge>
    </Stack>
  ),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Badge" };
