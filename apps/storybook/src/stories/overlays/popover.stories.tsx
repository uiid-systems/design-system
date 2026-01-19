import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlobeIcon } from "@uiid/icons";
import { Stack } from "@uiid/layout";
import { Popover } from "@uiid/overlays";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["beta"],
  args: {
    title: "Popover Title",
    description: "Popover Description",
    icon: GlobeIcon,
    action: <button>Action</button>,
    footer: "Popover Footer",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Popover {...args} trigger={<button>button</button>} />
      <Popover {...args} trigger="string" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Popover" };
