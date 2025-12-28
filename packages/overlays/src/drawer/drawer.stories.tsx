import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";

import { Drawer } from "./drawer";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  args: {
    title: "Drawer",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {},
  render: (args) => (
    <Group gap={8}>
      <Stack gap={4}>
        <Drawer {...args} trigger="open drawer from top" direction="top" />
        <Drawer {...args} trigger="open drawer from right" direction="right" />
        <Drawer {...args} trigger="open drawer from left" direction="left" />
        <Drawer
          {...args}
          trigger="open drawer from bottom"
          direction="bottom"
        />
      </Stack>

      <Stack gap={4}>
        <Drawer {...args} trigger={<button>button</button>} />
        <Drawer {...args} trigger="string" />
      </Stack>
    </Group>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Drawer" };
