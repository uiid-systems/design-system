import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";
import { Alert } from "./alert";

const meta = {
  title: "Indicators/Alert",
  component: Alert,
  args: {},
  render: (args) => (
    <Stack gap={4} fullwidth>
      <Alert {...args}>Alert</Alert>
      <Alert {...args} variant="inverted">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </Alert>
      <Alert {...args} variant="info">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </Alert>
      <Alert {...args} variant="warning">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </Alert>
      <Alert {...args} variant="error">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </Alert>
      <Alert {...args} variant="success">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </Alert>
    </Stack>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Alert" };
