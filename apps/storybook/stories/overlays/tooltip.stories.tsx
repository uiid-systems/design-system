import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Tooltip } from "@uiid/design-system";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["beta"],
  args: {
    children: "This is a tooltip",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Tooltip {...args} trigger={<button>button</button>} />
      <Tooltip {...args} trigger="string" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Tooltip" };
