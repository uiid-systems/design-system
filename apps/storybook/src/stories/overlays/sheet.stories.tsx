import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlobeIcon } from "@uiid/icons";
import { Stack } from "@uiid/layout";
import { Sheet } from "@uiid/overlays";

const meta: Meta<typeof Sheet> = {
  title: "Overlays/Sheet",
  component: Sheet,
  tags: ["beta"],
  args: {
    title: "Sheet Title",
    description: "Sheet Description",
    icon: GlobeIcon,
    action: <button>Action</button>,
    footer: "Sheet Footer",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      table: { category: "Variants" },
    },
  },
  render: (args) => (
    <Stack gap={4}>
      <Sheet {...args} trigger={<button>button</button>}></Sheet>
      <Sheet {...args} trigger="string"></Sheet>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Sheet" };
