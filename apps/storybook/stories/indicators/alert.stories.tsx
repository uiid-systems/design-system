import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Alert } from "@uiid/design-system";
import { GlobeIcon } from "@uiid/icons/globe";

const meta = {
  title: "Indicators/Alert",
  component: Alert,
  tags: ["danger"],
  args: {
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  render: (args) => (
    <Stack gap={4} fullwidth>
      <Alert {...args} action={<GlobeIcon />} />
      <Alert {...args} icon={GlobeIcon} action={<a href="#">Action</a>} />
    </Stack>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Alert" };
