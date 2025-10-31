import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@uiid/buttons";
import { Stack } from "@uiid/layout";

import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  args: {
    children: "This is a tooltip",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Tooltip {...args} trigger={<CustomTrigger />} />
      <Tooltip {...args} trigger={<NativeTrigger />} />
      <Tooltip {...args} trigger="string" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Tooltip" };

const CustomTrigger = () => (
  <Button variant="subtle" grows={false}>
    custom button component
  </Button>
);
const NativeTrigger = () => <button>native button</button>;
