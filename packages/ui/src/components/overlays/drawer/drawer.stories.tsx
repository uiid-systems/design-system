import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";

import { Drawer } from "./drawer";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  args: {
    trigger: "activate drawer",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Drawer {...args} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Drawer" };
