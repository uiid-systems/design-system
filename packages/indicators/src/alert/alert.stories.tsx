import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@uiid/icons";
import { Stack } from "@uiid/layout";

import { Alert } from "./alert";

const meta = {
  title: "Indicators/Alert",
  component: Alert,
  tags: ["danger"],
  args: {
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  render: (args) => (
    <Stack gap={4} fullwidth>
      <Alert {...args} action={<Globe />} />
      <Alert {...args} inverted icon={Globe} action={<a href="#">Action</a>} />
      <Alert {...args} tone="info" />
      <Alert {...args} tone="warning" />
      <Alert {...args} tone="negative" />
      <Alert {...args} tone="positive" />
    </Stack>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Alert" };
