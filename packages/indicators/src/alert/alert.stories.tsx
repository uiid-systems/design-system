import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Alert } from "./alert";

const meta = {
  title: "Indicators/Alert",
  component: Alert,
  tags: ["danger"],
  args: {
    title:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  argTypes: {
    // onDismiss: { action: "onDismiss" },
  },
  render: (args) => (
    <Stack gap={4} fullwidth>
      <Alert {...args} />
      <Alert {...args} variant="inverted" />
      <Alert {...args} variant="info" />
      <Alert {...args} variant="warning" />
      <Alert {...args} variant="negative" />
      <Alert {...args} variant="positive" />
    </Stack>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Alert" };
