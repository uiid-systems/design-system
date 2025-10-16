import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Popover } from "./popover";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  args: {
    title: "Popover",
    description: "This is a popover",
    trigger: "This is a popover trigger",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Popover {...args}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa
        hic, accusamus dolor cum minima pariatur provident vero blanditiis vel!
        Assumenda ipsum officia autem!
      </Popover>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Popover" };
