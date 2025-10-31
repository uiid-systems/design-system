import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Button } from "@uiid/buttons";

import { Popover } from "./popover";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  args: {
    title: "This is a popover",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Popover {...args} trigger={<CustomTrigger />} />
      <Popover {...args} trigger={<NativeTrigger />} />
      <Popover {...args} trigger="string" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Popover" };

const CustomTrigger = () => (
  <Button variant="subtle" grows={false}>
    custom button component
  </Button>
);
const NativeTrigger = () => <button>native button</button>;
